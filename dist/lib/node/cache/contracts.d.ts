/// <reference types="node" />
import type { IValueState } from '@flemist/async-utils';
export declare type PromiseOrValue<T> = Promise<T> | T;
export declare type Func<This, Args extends any[], Result> = (this: This, ...args: Args) => Result;
export declare type FuncAny = Func<any, any[], any>;
export declare type OfPromise<T> = T extends Promise<infer U> ? U : T;
export declare type ToPromise<T> = Promise<T extends Promise<infer U> ? U : T>;
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
export declare type BufferConverter<Value> = {
    valueToBuffer: (value: Value) => PromiseOrValue<Buffer>;
    bufferToValue: (buffer: Buffer) => PromiseOrValue<Value>;
};
