import fs from 'fs'
import path from 'path'
import {IPool, Pool, poolRunWait, Pools} from '@flemist/time-limits'
import * as os from 'os'
import {normalizePath} from '@rollup/pluginutils'
import {getStackTrace} from 'src/node/cache/getStackTrace'

export type DontThrowIfNotExist = {
  dontThrowIfNotExist?: boolean
}
export type ExistPath = (_path: string) => Promise<boolean>
export type DeletePath = (_path: string,) => Promise<boolean>
export type ReadFile = (filePath: string, params?: DontThrowIfNotExist)
  => Promise<Buffer | undefined>
export type WriteFile = (filePath: string, data: Buffer) => Promise<void>
export type PathStat = {
  isDirectory: boolean
  size: number
  dateCreated: number
  dateModified: number
}
export type GetFileStat = (filePath: string, params?: DontThrowIfNotExist)
  => Promise<PathStat | undefined>
export type ReadDir = (dirPath: string, params?: DontThrowIfNotExist)
  => Promise<string[] | undefined>

export type IFileController = {
  existPath: ExistPath
  getStat: GetFileStat
  readFile: ReadFile
  writeFile: WriteFile
  deletePath: DeletePath
  readDir: ReadDir
}

const filePool = new Pool(Math.min(os.cpus().length, 100))

type FileLock = {
  pool: IPool
  count: number
  path: string
}

const _lockPathMap = new Map<string, FileLock>()
async function lockPaths<T>(_paths: string[], func: () => Promise<T>): Promise<T> {
  const normalizedPaths = Array.from(new Set(_paths.map(normalizePath).filter(o => o)))
  const locks = normalizedPaths.map(path => {
    let lock = _lockPathMap.get(path)
    if (!lock) {
      lock = {
        pool : new Pool(1),
        count: 0,
        path,
      }
      _lockPathMap.set(path, lock)
    }
    return lock
  })
  locks.forEach(pool => pool.count++)
  const pools = new Pools(...locks.map(o => o.pool))
  return poolRunWait({
    pool : pools,
    count: 1,
    async func() {
      try {
        return await func()
      }
      finally {
        locks.forEach(pool => pool.count--)
        locks.forEach(pool => {
          if (pool.count <= 0) {
            _lockPathMap.delete(pool.path)
          }
        })
      }
    },
  })
}

const TEMP_EXT = `.${Math.random().toString(36).slice(2)}.tmp`

export const fileControllerDefault: IFileController = {
  async existPath(_path: string|undefined|null): Promise<boolean> {
    if (!_path) {
      return false
    }
    const stack = getStackTrace()
    try {
      return !!await fs.promises.stat(_path)
    }
    catch (err) {
      err.stack = err.stack ? err.stack + '\n' + stack : stack
      if (err.code === 'ENOENT') {
        return false
      }
      throw err
    }
  },

  readFile(filePath: string|undefined|null, params?: DontThrowIfNotExist): Promise<Buffer|undefined> {
    if (!filePath) {
      if (params?.dontThrowIfNotExist) {
        return Promise.resolve(void 0)
      }
      return Promise.reject(new Error('File path is empty'))
    }
    const stack = getStackTrace()
    return poolRunWait({
      pool : filePool,
      count: 1,
      func : () => fs.promises.readFile(filePath).catch(err => {
        err.stack = err.stack ? err.stack + '\n' + stack : stack
        if (params?.dontThrowIfNotExist && err.code === 'ENOENT') {
          return void 0
        }
        throw err
      }),
    })
  },

  async writeFile(filePath: string, data: Buffer) {
    filePath = path.resolve(filePath)
    const dir = path.dirname(filePath)
    const stack = getStackTrace()
    await poolRunWait({
      pool : filePool,
      count: 1,
      func : async () => {
        if (!await this.existPath(dir)) {
          try {
            await fs.promises.mkdir(dir, {recursive: true})
          }
          catch (err) {
            err.stack = err.stack ? err.stack + '\n' + stack : stack
            if (err.code !== 'EEXIST') {
              throw err
            }
          }
        }
        try {
          await fs.promises.writeFile(filePath + TEMP_EXT, data)
          await fs.promises.rm(filePath, {force: true})
          await fs.promises.rename(filePath + TEMP_EXT, filePath)
        }
        catch (err) {
          err.stack = err.stack ? err.stack + '\n' + stack : stack
          throw err
        }
      },
    })
  },

  async getStat(filePath: string|undefined|null, params?: DontThrowIfNotExist): Promise<PathStat|undefined> {
    if (!filePath) {
      if (params?.dontThrowIfNotExist) {
        return Promise.resolve(void 0)
      }
      return Promise.reject(new Error('File path is empty'))
    }
    const stack = getStackTrace()
    const stat = await fs.promises.stat(filePath).catch((err) => {
      err.stack = err.stack ? err.stack + '\n' + stack : stack
      if (params?.dontThrowIfNotExist && err.code === 'ENOENT') {
        return void 0
      }
      throw err
    })
    return stat && {
      isDirectory : stat.isDirectory(),
      size        : stat.size,
      dateCreated : Math.min(stat.birthtimeMs, stat.mtimeMs),
      dateModified: stat.mtimeMs,
    }
  },

  async deletePath(_path: string|undefined|null): Promise<boolean> {
    if (!_path || !await this.existPath(_path)) {
      return false
    }

    const stack = getStackTrace()
    await fs.promises.rm(_path, {recursive: true, force: true}).catch(err => {
      err.stack = err.stack ? err.stack + '\n' + stack : stack
      if (err.code === 'ENOENT') {
        return null
      }
      throw err
    })

    return true
  },

  readDir(dirPath: string, params?: DontThrowIfNotExist): Promise<string[] | undefined> {
    const stack = getStackTrace()
    return poolRunWait({
      pool : filePool,
      count: 1,
      func : () => fs.promises.readdir(dirPath).catch(err => {
        err.stack = err.stack ? err.stack + '\n' + stack : stack
        if (params?.dontThrowIfNotExist && err.code === 'ENOENT') {
          return void 0
        }
        throw err
      }),
    })
  },
}

export class FileControllerMock implements IFileController {
  private readonly _files = new Map<string, {
    data: Buffer
    stat: PathStat
  }>()

  constructor() {

  }

  existPath(_path: string): Promise<boolean> {
    return Promise.resolve(this._files.has(_path))
  }

  readFile(filePath: string, params?: DontThrowIfNotExist): Promise<Buffer | undefined> {
    if (!this._files.has(filePath)) {
      if (params?.dontThrowIfNotExist) {
        return Promise.resolve(void 0)
      }
      return Promise.reject(new Error('File is not exist: ' + filePath))
    }
    return Promise.resolve(this._files.get(filePath)?.data)
  }

  writeFile(filePath: string, data: Buffer) {
    const file = this._files.get(filePath)
    const now = Date.now()
    this._files.set(filePath, {
      data,
      stat: {
        isDirectory : false,
        size        : data.length,
        dateCreated : file?.stat.dateCreated ?? now,
        dateModified: now,
      },
    })
    return Promise.resolve()
  }

  getStat(filePath: string, params?: DontThrowIfNotExist): Promise<PathStat | undefined> {
    if (!this._files.has(filePath)) {
      if (params?.dontThrowIfNotExist) {
        return Promise.resolve(void 0)
      }
      return Promise.reject(new Error('File is not exist: ' + filePath))
    }
    return Promise.resolve(this._files.get(filePath)?.stat)
  }

  async deletePath(_path: string): Promise<boolean> {
    if (!await this.existPath(_path)) {
      return false
    }

    Array.from(this._files.keys())
      .filter(filePath => filePath.startsWith(_path))
      .forEach(filePath => this._files.delete(filePath))

    return true
  }

  readDir(dirPath: string, params?: DontThrowIfNotExist): Promise<string[] | undefined> {
    const files = Array.from(this._files.keys())
      .filter(filePath => filePath.startsWith(dirPath))
      .map(filePath => filePath.slice(dirPath.length))
      .filter(filePath => !filePath.includes('/'))

    return Promise.resolve(files)
  }
}
