import type {IValueState} from '@flemist/async-utils'

export type PromiseOrValue<T> = Promise<T> | T
export type Func<This, Args extends any[], Result>
  = (this: This, ...args: Args) => Result

export type FuncAny = Func<any, any[], any>

export type OfPromise<T> = T extends Promise<infer U> ? U : T

export type ToPromise<T> = Promise<T extends Promise<infer U> ? U : T>

export type GetKeyFunc<This, Args extends any[], Key> = Func<This, Args, PromiseOrValue<Key>>

export type CacheItem<Value, Options> = {
  value: Value
  options: Options
}

export type CacheItemAsync<Value, Options> = {
  value: PromiseOrValue<Value>
  options: Options
}

export type Lock = <T>(func: () => T) => ToPromise<T>

export type CacheStrategy<Key, Result, This = any, Args extends any[] = any[]> = (
  func: (
    state?: IValueState<Result>,
  ) => Promise<IValueState<Result>>,
  key: Key,
  lock: Lock,
  _this: This,
  args: Args
) => Promise<Result>

export type BufferConverter<Value> = {
  valueToBuffer: (value: Value) => PromiseOrValue<Buffer>
  bufferToValue: (buffer: Buffer) => PromiseOrValue<Value>
}
