/// <reference types="node" />
export declare type DontThrowIfNotExist = {
    dontThrowIfNotExist?: boolean;
};
export declare type ExistPath = (_path: string) => Promise<boolean>;
export declare type DeletePath = (_path: string) => Promise<boolean>;
export declare type ReadFile = (filePath: string, params?: DontThrowIfNotExist) => Promise<Buffer | undefined>;
export declare type WriteFile = (filePath: string, data: Buffer) => Promise<void>;
export declare type PathStat = {
    isDirectory: boolean;
    size: number;
    dateCreated: number;
    dateModified: number;
};
export declare type GetFileStat = (filePath: string, params?: DontThrowIfNotExist) => Promise<PathStat | undefined>;
export declare type ReadDir = (dirPath: string, params?: DontThrowIfNotExist) => Promise<string[] | undefined>;
export declare type IFileController = {
    existPath: ExistPath;
    getStat: GetFileStat;
    readFile: ReadFile;
    writeFile: WriteFile;
    deletePath: DeletePath;
    readDir: ReadDir;
};
export declare const fileControllerDefault: IFileController;
export declare class FileControllerMock implements IFileController {
    private readonly _files;
    constructor();
    existPath(_path: string): Promise<boolean>;
    readFile(filePath: string, params?: DontThrowIfNotExist): Promise<Buffer | undefined>;
    writeFile(filePath: string, data: Buffer): Promise<void>;
    getStat(filePath: string, params?: DontThrowIfNotExist): Promise<PathStat | undefined>;
    deletePath(_path: string): Promise<boolean>;
    readDir(dirPath: string, params?: DontThrowIfNotExist): Promise<string[] | undefined>;
}
