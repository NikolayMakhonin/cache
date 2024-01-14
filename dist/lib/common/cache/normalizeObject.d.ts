export declare const DELETE: unique symbol;
export declare type NormalizeObjectArgs = {
    /** return DELETE to delete value */
    custom?: (_path: readonly string[], value: any) => any;
    dontDeleteNullKeys?: boolean;
};
export declare function normalizeObject<T>(obj: T, args?: NormalizeObjectArgs): T;
