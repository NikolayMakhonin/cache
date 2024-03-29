import { createTestVariants } from '@flemist/test-variants'
import { delay, PromiseOrValue } from '@flemist/async-utils'
import { TimeControllerMock } from '@flemist/time-controller'
import { toCached } from 'src/common/cache/toCached'
import { awaitTime } from '@flemist/test-utils'
import {createFileCacheStrategy} from './createFileCacheStrategy'
import {createBufferConverterJson} from './bufferConverters'
import {getHashKeyFunc} from 'src/node/cache/getHashKeyFunc'
import {FileControllerMock} from './FileController'
import fs from 'fs'

describe('toCached', function () {
  this.timeout(300000)

  const cacheDir = 'tmp/test/createFileCacheStrategy'

  type Result = [callId: number, value: number]

  const timeController = new TimeControllerMock()
  const fileController = new FileControllerMock()

  let callId = 0
  function func(value: number, delayMs?: 0): Result
  function func(value: number, delayMs?: number): Promise<Result>
  function func(value: number, delayMs?: number): PromiseOrValue<Result> {
    const _callId = ++callId
    if (delayMs) {
      return delay(delayMs, null, timeController).then(() => [_callId, value])
    }
    return [_callId, value]
  }

  let value = 1000000

  const testVariants = createTestVariants(async ({
    callTime,
    updateInterval,
    lifeTime,
  }: {
    callTime: number
    updateInterval: number
    lifeTime: number
  }) => {
    const cachedFunc = toCached(func, {
      getKey  : getHashKeyFunc(),
      strategy: createFileCacheStrategy({
        dir      : cacheDir,
        converter: createBufferConverterJson({ pretty: true }),
        fileController,
      }),
    })

    const promise = Promise.all([
      value++,
      value++,
      value++,
    ].map(async value => {
      let timeStart = timeController.now()
      let result = await cachedFunc(value, callTime)
      let timeEnd = timeController.now()
      let callId = result[0]
      assert.deepStrictEqual(result, [callId, value])
      assert.strictEqual(timeEnd - timeStart, callTime)

      timeStart = timeController.now()
      result = await cachedFunc(value, callTime)
      timeEnd = timeController.now()
      assert.deepStrictEqual(result, [callId, value])
      // assert.strictEqual(timeEnd - timeStart, 0) // TODO: fix this

      if (lifeTime) {
        if (updateInterval) {
          await delay(updateInterval + callTime + 1, null, timeController)
          timeStart = timeController.now()
          result = await cachedFunc(value, callTime)
          timeEnd = timeController.now()
          assert.notStrictEqual(result[0], callId)
          callId = result[0]
          assert.deepStrictEqual(result, [callId, value])
          assert.strictEqual(timeEnd - timeStart, 0)
          await delay(lifeTime + updateInterval + callTime + 1, null, timeController)
        }
        else {
          await delay(lifeTime, null, timeController)
        }

        timeStart = timeController.now()
        result = await cachedFunc(value, callTime)
        timeEnd = timeController.now()
        assert.notStrictEqual(result[0], callId)
        callId = result[0]
        assert.deepStrictEqual(result, [callId, value])
        assert.strictEqual(timeEnd - timeStart, callTime)
      }

      console.log('OK', value)
    }))

    await Promise.all([
      promise,
      awaitTime(timeController, (lifeTime || Math.max(updateInterval, callTime) + 1) + callTime * 3 + updateInterval + 1 + 100, 30),
    ])
  })

  it('base', async function () {
    await testVariants({
      updateInterval: [0],
      callTime      : [0, 1, 5],
      lifeTime      : [null],
    })()
  })

  it('stress', async function () {
    const COUNT_KEYS = 10
    const COUNT_CALLS = 1000

    const values = new Map<number, number>()
    const locks = new Set<number>()

    function func(key: number) {
      if (locks.has(key)) {
        throw new Error(`lock is not working ${key}`)
      }

      locks.add(key)
      let result = values.get(key)
      if (result == null) {
        result = key * 2 < COUNT_CALLS ? (key % 3) * 1000000 : key * 1000000
      }
      else {
        result++
      }
      values.set(key, result)

      if (key * 4 < COUNT_CALLS) {
        return delay(COUNT_CALLS - result).then(() => {
          locks.delete(key)
          return result
        })
      }

      // console.log(`func(${value}) = ${result}`)
      locks.delete(key)
      return result
    }

    const cashedFunc = toCached(func, {
      getKey(value) {
        return value + ''
      },
      strategy: createFileCacheStrategy({
        dir      : cacheDir,
        converter: createBufferConverterJson({ pretty: true }),
      }),
    })

    await fs.promises.rm(cacheDir, {recursive: true, force: true}).catch(() => null)

    const results = await Promise.all(
      Array.from({length: COUNT_KEYS})
        .flatMap((_, key) => Array.from({length: COUNT_CALLS}, () => cashedFunc(key))),
    )

    for (let i = 0, len = results.length; i < len; i++) {
      const key = Math.floor(i / COUNT_CALLS)
      const checkResult = key * 2 < COUNT_CALLS ? (key % 3) * 1000000 : key * 1000000
      const result = results[i]
      assert.strictEqual(result, checkResult)
    }
  })
})
