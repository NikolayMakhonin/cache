export declare type NormalizeObjectArgs = {
    filter?: (_path: string[], value: any) => boolean;
    convertUnknown?: (value: any) => any;
};
export declare function normalizeObject<T>(obj: T, args?: NormalizeObjectArgs, _path?: string[]): T;
