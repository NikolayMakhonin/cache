import type {
  CacheStrategy,
  Func,
  GetKeyFunc,
  OfPromise,
  ToPromise,
  Lock,
} from './contracts'
import {Pool, poolRunWait} from '@flemist/time-limits'
import type { IValueState } from '@flemist/async-utils'
import { isPromiseLike, createValueState } from '@flemist/async-utils'

export function toCached<
  This, Args extends any[], Result,
  Key,
>(
  func: Func<This, Args, Result>,
  {
    getKey,
    strategy,
  }: {
    getKey: GetKeyFunc<This, Args, Key>
    strategy: CacheStrategy<Key, OfPromise<Result>, This, Args>
  },
): Func<This, Args, ToPromise<Result>> {
  const lockers = new Map<Key, {
    lock: Lock,
    count: number,
  }>()
  return async function cached(...args) {
    let key = getKey.apply(this, args)
    if (isPromiseLike(key)) {
      // eslint-disable-next-line require-atomic-updates
      key = await key
    }

    let locker = lockers.get(key)
    if (!locker) {
      const lock: Lock = <T>(func) => poolRunWait<T>({
        pool : new Pool(1),
        count: 1,
        func,
      })
      locker = {
        lock,
        count: 1,
      }
      lockers.set(key, locker)
    }
    else {
      locker.count++
    }

    const _func = async (
      state?: IValueState<OfPromise<Result>>,
    ): Promise<IValueState<OfPromise<Result>>> => {
      if (!state) {
        state = createValueState()
      }
      try {
        state.loading = true
        let value = func.apply(this, args)
        if (isPromiseLike(value)) {
          value = await value
        }
        state.value = value
        state.hasValue = true
        state.hasError = false
      }
      catch (err) {
        state.error = err
        state.hasError = true
      }
      finally {
        state.loading = false
      }
      return state
    }

    try {
      const result = await strategy(_func, key, locker.lock, this, args)
      return result
    }
    finally {
      locker.count--
      if (locker.count === 0) {
        lockers.delete(key)
      }
    }
  }
}

