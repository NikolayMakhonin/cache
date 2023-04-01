/// <reference types="node" />
export declare type ExistPath = (_path: string) => Promise<boolean>;
export declare type DeletePath = (_path: string) => Promise<boolean>;
export declare type ReadFile = (filePath: string) => Promise<Buffer>;
export declare type WriteFile = (filePath: string, data: Buffer) => Promise<void>;
export declare type FileStat = {
    size: number;
    dateCreated: number;
    dateModified: number;
};
export declare type GetFileStat = (filePath: string) => Promise<FileStat>;
export declare type IFileController = {
    existPath: ExistPath;
    getStat: GetFileStat;
    readFile: ReadFile;
    writeFile: WriteFile;
    deletePath: DeletePath;
};
export declare const fileControllerDefault: IFileController;
export declare class FileControllerMock implements IFileController {
    private readonly _files;
    constructor();
    existPath(_path: string): Promise<boolean>;
    readFile(filePath: string): Promise<Buffer>;
    writeFile(filePath: string, data: Buffer): Promise<void>;
    getStat(filePath: string): Promise<FileStat>;
    deletePath(_path: string): Promise<boolean>;
}
