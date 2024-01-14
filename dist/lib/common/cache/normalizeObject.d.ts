export declare type NormalizeObjectArgs = {
    filter?: (_path: string[], value: any) => boolean;
    convertUnknown?: (value: any) => any;
    dontDeleteNullKeys?: boolean;
};
export declare function normalizeObject<T>(obj: T, args?: NormalizeObjectArgs, _path?: string[]): T;
