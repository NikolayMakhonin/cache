import { IFileController, PathStat } from "./..";
export declare type PathWithStat = {
    path: string;
    stat: PathStat;
};
export declare function readDirRecursive(fileController: IFileController, dirPath: string): Promise<PathWithStat[]>;
