import { BufferConverter, IFileController, StringConverter } from "./..";
export interface IAsyncMap<K, V> {
    set(key: K, value: V): Promise<void>;
    get(key: K): Promise<V | undefined>;
    delete(key: K): Promise<void>;
    /** Check the key if exists */
    hasKey(key: K): Promise<boolean>;
    /** Check the key and value if exists, and value is not corrupted */
    hasValue(key: K): Promise<boolean>;
    keys(): Promise<K[]>;
    clear(): Promise<void>;
}
export declare type FileMapOptions = {
    useHash?: boolean;
    deleteIfHashIncorrect?: boolean;
};
export declare type FileMapArgs<Key, Value> = {
    dir: string;
    keyPathConverter: StringConverter<Key>;
    valueBufferConverter: BufferConverter<Value>;
    fileController?: IFileController;
    options?: FileMapOptions;
};
export declare class FileMap<Key, Value> implements IAsyncMap<Key, Value> {
    private readonly _dir;
    private readonly _keyPathConverter;
    private readonly _valueBufferConverter;
    private readonly _fileController;
    private readonly _options;
    constructor({ dir, keyPathConverter, valueBufferConverter, fileController, options, }: FileMapArgs<Key, Value>);
    private _getFilePath;
    set(key: Key, value: Value): Promise<void>;
    get(key: Key): Promise<Value | undefined>;
    delete(key: Key): Promise<void>;
    private _has;
    hasKey(key: Key): Promise<boolean>;
    hasValue(key: Key): Promise<boolean>;
    keys(): Promise<Key[]>;
    clear(): Promise<void>;
}
