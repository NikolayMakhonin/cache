/// <reference types="node" />
import type { PromiseOrValue } from '@flemist/async-utils';
export declare type BufferConverter<Value> = {
    valueToBuffer: (value: Value) => PromiseOrValue<Buffer>;
    bufferToValue: (buffer: Buffer) => PromiseOrValue<Value>;
};
