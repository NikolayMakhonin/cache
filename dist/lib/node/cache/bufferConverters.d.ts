import type { BufferConverter } from './contracts';
declare type BufferEncoding = 'ascii' | 'utf8' | 'utf-8' | 'utf16le' | 'ucs2' | 'ucs-2' | 'base64' | 'base64url' | 'latin1' | 'binary' | 'hex';
export declare function createBufferConverterString({ encoding, }?: {
    encoding?: BufferEncoding;
}): BufferConverter<string>;
export declare function createBufferConverterJson<T>({ pretty, }?: {
    pretty?: boolean;
}): BufferConverter<T>;
export {};
