import type {BufferConverter} from './contracts'
import type {IValueState, PromiseOrValue} from '@flemist/async-utils'
import path from 'path'
import {fileControllerDefault, PathStat, IFileController} from './FileController'
import crypto from 'crypto'
import {CacheItem, CacheStrategy, Lock} from 'src/common/cache/contracts'

export type FileCacheOptions<
  Result = any,
  This = any,
  Args extends any[] = any[],
> = {
  dir: string
  converter: BufferConverter<Result>
  filterArgs?: (this: This, args: Args) => PromiseOrValue<boolean>
  filterResult?: (this: This, state: IValueState<Result>, args: Args) => PromiseOrValue<boolean>
  fileController?: IFileController
  isExpired?: (this: This, state: IValueState<Result>, args: Args, fileStat: PathStat) => PromiseOrValue<boolean>
  checkHash?: boolean
}

// function hashToPathOld(hash: string) {
//   return hash.substring(0, 2)
//     + '/' + hash.substring(2, 4)
//     + '/' + hash.substring(4, 6)
//     + '/' + hash.substring(6)
// }

function hashToPath(hash: string) {
  return hash.substring(0, 2)
    + '/' + hash.substring(2)
}

export function createFileCacheStrategy<
  Result = any,
  This = any,
  Args extends any[] = any[],
>({
  dir,
  converter,
  filterArgs,
  filterResult,
  fileController,
  isExpired,
  checkHash,
}: FileCacheOptions<Result>): CacheStrategy<string, Result, This, Args> {
  if (!fileController) {
    fileController = fileControllerDefault
  }

  return async function fileCacheStrategy(
    func: (
      state?: IValueState<Result>,
    ) => Promise<IValueState<Result>>,
    key: string,
    lock: Lock,
    _this: This,
    args: Args,
  ): Promise<Result> {
    type Options = {
      hash: string,
    }

    return lock(async () => {
      let state: IValueState<Result>
      if (filterArgs && !await filterArgs.call(_this, args)) {
        state = await func()
      }
      else {
        let cacheItem: CacheItem<IValueState<Result>, Options>

        const cacheItemFilePath = path.resolve(dir, hashToPath(key + '_meta'))
        // const cacheItemFilePathOld = path.resolve(dir, hashToPathOld(key + '_meta'))
        // if (await fileController.existPath(cacheItemFilePathOld)) {
        //   const dir = path.dirname(cacheItemFilePath)
        //   if (!await fs.promises.stat(dir).catch(() => null)) {
        //     await fs.promises.mkdir(dir, {recursive: true})
        //   }
        //   await fs.promises.rename(cacheItemFilePathOld, cacheItemFilePath)
        // }
        const cacheItemFileStat = await fileController.getStat(cacheItemFilePath).catch(() => null)
        if (cacheItemFileStat) {
          const cacheItemBuffer = await fileController.readFile(cacheItemFilePath)
          const cacheItemStr = cacheItemBuffer?.toString('utf-8')
          if (cacheItemStr) {
            try {
              cacheItem = JSON.parse(cacheItemStr)
            }
            catch (err) {
              console.warn('Error parse cacheItem for: ' + key)
            }
          }
          if (cacheItem) {
            state = cacheItem.value
            if (state.hasValue) {
              const valueFilePath = path.resolve(dir, hashToPath(cacheItem.options.hash))
              // const valueFilePathOld = path.resolve(dir, hashToPathOld(cacheItem.options.hash))
              // if (await fileController.existPath(valueFilePathOld)) {
              //   const dir = path.dirname(valueFilePath)
              //   if (!await fs.promises.stat(dir).catch(() => null)) {
              //     await fs.promises.mkdir(dir, {recursive: true})
              //   }
              //   await fs.promises.rename(valueFilePathOld, valueFilePath)
              // }
              const valueFileStat = await fileController.getStat(valueFilePath).catch(() => null)
              if (!valueFileStat) {
                console.warn('Value file not found: ' + valueFilePath)
                cacheItem = null
                state = null
              }
              else {
                const valueBuffer = await fileController.readFile(valueFilePath)

                const _checkHash = checkHash && crypto.createHash('sha256').update(valueBuffer).digest('base64url')
                if (checkHash && _checkHash !== cacheItem.options.hash) {
                  console.warn('Incorrect hash for: ' + key)
                  await fileController.deletePath(valueFilePath)
                  cacheItem = null
                  state = null
                }
                else {
                  state.value = await converter.bufferToValue(valueBuffer)
                  if (isExpired && await isExpired.call(_this, state, args, valueFileStat)) {
                    console.log('Expired cacheItem for: ' + key)
                    await fileController.deletePath(valueFilePath)
                    cacheItem = null
                    state = null
                  }
                }
              }
            }
            else if (isExpired && await isExpired.call(_this, state, args, cacheItemFileStat)) {
              console.log('Expired cacheItem for: ' + key)
              await fileController.deletePath(cacheItemFilePath)
              cacheItem = null
              state = null
            }
          }
        }

        if (!state) {
          state = await func()
          if (!filterResult || filterResult.call(_this, state, args)) {
            const valueBuffer = state.hasValue ? await converter.valueToBuffer(state.value) : null
            const hash = valueBuffer && crypto.createHash('sha256').update(valueBuffer).digest('base64url')
            const valueFilePath = hash && path.resolve(dir, hashToPath(hash))

            cacheItem = {
              value  : {...state, value: void 0},
              options: {
                hash,
              },
            }

            const cacheItemStr = JSON.stringify(cacheItem, null, 2)
            const cacheItemBuffer = cacheItemStr && Buffer.from(cacheItemStr, 'utf-8')
            await Promise.all([
              cacheItemBuffer && fileController.writeFile(cacheItemFilePath, cacheItemBuffer),
              valueBuffer && fileController.writeFile(valueFilePath, valueBuffer),
            ])
          }
        }
      }

      if (!state.hasValue) {
        throw state.error || new Error(`state.error = ${state.error}`)
      }
      return state.value
    })
  }
}
