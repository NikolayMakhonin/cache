import type { ITimeController } from '@flemist/time-controller';
import { CacheStrategy } from "./contracts";
export declare type MemCacheOptions = {
    lifeTime: number;
    updateInterval?: number;
    timeController?: ITimeController;
};
export declare function createMemCacheStrategy<Key = any, Result = any, This = any, Args extends any[] = any[]>({ lifeTime, updateInterval, timeController, }: MemCacheOptions): CacheStrategy<Key, Result, This, Args>;
