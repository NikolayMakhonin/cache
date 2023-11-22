/// <reference types="node" />
import type { PromiseOrValue } from '@flemist/async-utils';
export declare type BufferConverter<Value> = {
    valueToBuffer: (value: Value) => PromiseOrValue<Buffer>;
    bufferToValue: (buffer: Buffer) => PromiseOrValue<Value>;
};
export declare type StringConverter<Value> = {
    valueToString: (value: Value) => string;
    stringToValue: (str: string) => Value;
};
