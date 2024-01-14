import type { IValueState } from '@flemist/async-utils'
import { delay, isPromiseLike } from '@flemist/async-utils'
import type { ITimeController } from '@flemist/time-controller'
import { timeControllerDefault } from '@flemist/time-controller'
import {CacheItemAsync, CacheStrategy, Lock} from 'src/common/cache/contracts'

export type MemCacheOptions = {
  lifeTime?: number,
  updateInterval?: number,
  timeController?: ITimeController,
}

export function createMemCacheStrategy<
  Key = any,
  Result = any,
  This = any,
  Args extends any[] = any[],
>({
  lifeTime,
  updateInterval,
  timeController,
}: MemCacheOptions = {}): CacheStrategy<Key, Result, This, Args> {
  if (!timeController) {
    timeController = timeControllerDefault
  }

  type Options = {
    dateCreated: number
    dateRequest: number
  }
  const cache = new Map<Key, CacheItemAsync<IValueState<Result>, Options>>()

  return async function memCacheStrategy(
    func: (
      state?: IValueState<Result>,
    ) => Promise<IValueState<Result>>,
    key: Key,
    lock: Lock,
  ): Promise<Result> {
    let cacheItem = cache.get(key)

    async function process() {
      const state = isPromiseLike(cacheItem.value)
        ? await cacheItem.value
        : cacheItem.value

      cacheItem.options.dateRequest = timeController.now()

      while (true) {
        if (!state.hasValue) {
          cache.delete(key)
          break
        }

        if (updateInterval) {
          await delay(updateInterval, null, timeController)

          if (lifeTime != null && timeController.now() - cacheItem.options.dateRequest > lifeTime) {
            cache.delete(key)
            break
          }

          await func(state)
        }
        else {
          if (lifeTime != null) {
            await delay(lifeTime, null, timeController)
          }
          cache.delete(key)
          break
        }
      }
    }

    if (!cacheItem) {
      cacheItem = {
        value  : func(),
        options: {
          dateCreated: timeController.now(),
          dateRequest: timeController.now(),
        },
      }
      cache.set(key, cacheItem)
      void process()
    }

    const state = isPromiseLike(cacheItem.value)
      ? await cacheItem.value
      : cacheItem.value

    cacheItem.options.dateRequest = timeController.now()

    if (!state.hasValue) {
      throw state.error || new Error(`state.error = ${state.error}`)
    }
    return state.value
  }
}
