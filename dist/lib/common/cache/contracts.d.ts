import { Func, IValueState, PromiseOrValue, ToPromise } from "@flemist/async-utils";
export declare type GetKeyFunc<This, Args extends any[], Key> = Func<This, Args, PromiseOrValue<Key>>;
export declare type CacheItem<Value, Options> = {
    value: Value;
    options: Options;
};
export declare type CacheItemAsync<Value, Options> = {
    value: PromiseOrValue<Value>;
    options: Options;
};
export declare type Lock = <T>(func: () => T) => ToPromise<T>;
export declare type CacheStrategy<Key, Result, This = any, Args extends any[] = any[]> = (func: (state?: IValueState<Result>) => Promise<IValueState<Result>>, key: Key, lock: Lock, _this: This, args: Args) => Promise<Result>;
