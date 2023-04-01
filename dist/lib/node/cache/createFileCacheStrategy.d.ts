import type { BufferConverter } from './contracts';
import type { IValueState, PromiseOrValue } from '@flemist/async-utils';
import { FileStat, IFileController } from './FileController';
import { CacheStrategy } from "../../common/cache/contracts";
export declare type FileCacheOptions<Result = any, This = any, Args extends any[] = any[]> = {
    dir: string;
    converter: BufferConverter<Result>;
    filterArgs?: (this: This, args: Args) => PromiseOrValue<boolean>;
    filterResult?: (this: This, state: IValueState<Result>, args: Args) => PromiseOrValue<boolean>;
    fileController?: IFileController;
    isExpired?: (this: This, state: IValueState<Result>, args: Args, fileStat: FileStat) => PromiseOrValue<boolean>;
    checkHash?: boolean;
};
export declare function createFileCacheStrategy<Result = any, This = any, Args extends any[] = any[]>({ dir, converter, filterArgs, filterResult, fileController, isExpired, checkHash, }: FileCacheOptions<Result>): CacheStrategy<string, Result, This, Args>;
