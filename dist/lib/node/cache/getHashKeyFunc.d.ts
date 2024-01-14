import { NormalizeObjectArgs } from "../../common";
export declare function getHashKeyFunc(args?: {
    algorithm?: string;
} & NormalizeObjectArgs): (obj?: any) => string;
