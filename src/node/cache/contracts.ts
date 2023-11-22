import type {PromiseOrValue} from '@flemist/async-utils'

export type BufferConverter<Value> = {
  valueToBuffer: (value: Value) => PromiseOrValue<Buffer>
  bufferToValue: (buffer: Buffer) => PromiseOrValue<Value>
}

export type StringConverter<Value> = {
  valueToString: (value: Value) => string
  stringToValue: (str: string) => Value
}
