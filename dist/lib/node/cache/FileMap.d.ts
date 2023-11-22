import { BufferConverter, IFileController, StringConverter } from "./..";
export interface IAsyncMap<K, V> {
    set(key: K, value: V): Promise<void>;
    get(key: K): Promise<V | undefined>;
    delete(key: K): Promise<void>;
    has(key: K): Promise<boolean>;
    keys(): Promise<K[]>;
    clear(): Promise<void>;
}
export declare type FileMapArgs<Key, Value> = {
    dir: string;
    keyPathConverter: StringConverter<Key>;
    valueBufferConverter: BufferConverter<Value>;
    fileController?: IFileController;
};
export declare class FileMap<Key, Value> implements IAsyncMap<Key, Value> {
    private readonly _dir;
    private readonly _keyPathConverter;
    private readonly _valueBufferConverter;
    private readonly _fileController;
    constructor({ dir, keyPathConverter, valueBufferConverter, fileController, }: FileMapArgs<Key, Value>);
    private _getFilePath;
    set(key: Key, value: Value): Promise<void>;
    get(key: Key): Promise<Value | undefined>;
    delete(key: Key): Promise<void>;
    has(key: Key): Promise<boolean>;
    keys(): Promise<Key[]>;
    clear(): Promise<void>;
}
