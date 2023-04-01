import type { CacheStrategy, Func, GetKeyFunc, OfPromise, ToPromise } from './contracts';
export declare function toCached<This, Args extends any[], Result, Key>(func: Func<This, Args, Result>, { getKey, strategy, }: {
    getKey: GetKeyFunc<This, Args, Key>;
    strategy: CacheStrategy<Key, OfPromise<Result>, This, Args>;
}): Func<This, Args, ToPromise<Result>>;
