import { __awaiter } from 'tslib';
import fs from 'fs';
import path from 'path';
import { Pool, poolRunWait } from '@flemist/time-limits';
import * as os from 'os';

const filePool = new Pool(Math.min(os.cpus().length, 100));
const fileControllerDefault = {
    existPath(_path) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return !!(yield fs.promises.stat(_path));
            }
            catch (_a) {
                return false;
            }
        });
    },
    readFile(filePath, params) {
        return poolRunWait({
            pool: filePool,
            count: 1,
            func: () => fs.promises.readFile(filePath).catch(err => {
                if ((params === null || params === void 0 ? void 0 : params.dontThrowIfNotExist) && err.code === 'ENOENT') {
                    return void 0;
                }
                throw err;
            }),
        });
    },
    writeFile(filePath, data) {
        return __awaiter(this, void 0, void 0, function* () {
            filePath = path.resolve(filePath);
            const dir = path.dirname(filePath);
            yield poolRunWait({
                pool: filePool,
                count: 1,
                func: () => __awaiter(this, void 0, void 0, function* () {
                    if (!(yield this.existPath(dir))) {
                        try {
                            yield fs.promises.mkdir(dir, { recursive: true });
                        }
                        catch (err) {
                            if (err.code !== 'EEXIST') {
                                throw err;
                            }
                        }
                    }
                    yield fs.promises.writeFile(filePath, data);
                }),
            });
        });
    },
    getStat(filePath, params) {
        return __awaiter(this, void 0, void 0, function* () {
            const stat = yield fs.promises.stat(filePath).catch((err) => {
                if ((params === null || params === void 0 ? void 0 : params.dontThrowIfNotExist) && err.code === 'ENOENT') {
                    return void 0;
                }
                throw err;
            });
            return stat && {
                isDirectory: stat.isDirectory(),
                size: stat.size,
                dateCreated: Math.min(stat.birthtimeMs, stat.mtimeMs),
                dateModified: stat.mtimeMs,
            };
        });
    },
    deletePath(_path) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!(yield this.existPath(_path))) {
                return false;
            }
            yield fs.promises.rm(_path, { recursive: true, force: true }).catch(err => {
                if (err.code === 'ENOENT') {
                    return null;
                }
                throw err;
            });
            return true;
        });
    },
    readDir(dirPath, params) {
        return poolRunWait({
            pool: filePool,
            count: 1,
            func: () => fs.promises.readdir(dirPath).catch(err => {
                if ((params === null || params === void 0 ? void 0 : params.dontThrowIfNotExist) && err.code === 'ENOENT') {
                    return void 0;
                }
                throw err;
            }),
        });
    },
};
class FileControllerMock {
    constructor() {
        this._files = new Map();
    }
    existPath(_path) {
        return Promise.resolve(this._files.has(_path));
    }
    readFile(filePath, params) {
        var _a;
        if (!this._files.has(filePath)) {
            if (params === null || params === void 0 ? void 0 : params.dontThrowIfNotExist) {
                return Promise.resolve(void 0);
            }
            return Promise.reject(new Error('File is not exist: ' + filePath));
        }
        return Promise.resolve((_a = this._files.get(filePath)) === null || _a === void 0 ? void 0 : _a.data);
    }
    writeFile(filePath, data) {
        var _a;
        const file = this._files.get(filePath);
        const now = Date.now();
        this._files.set(filePath, {
            data,
            stat: {
                isDirectory: false,
                size: data.length,
                dateCreated: (_a = file === null || file === void 0 ? void 0 : file.stat.dateCreated) !== null && _a !== void 0 ? _a : now,
                dateModified: now,
            },
        });
        return Promise.resolve();
    }
    getStat(filePath, params) {
        var _a;
        if (!this._files.has(filePath)) {
            if (params === null || params === void 0 ? void 0 : params.dontThrowIfNotExist) {
                return Promise.resolve(void 0);
            }
            return Promise.reject(new Error('File is not exist: ' + filePath));
        }
        return Promise.resolve((_a = this._files.get(filePath)) === null || _a === void 0 ? void 0 : _a.stat);
    }
    deletePath(_path) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!(yield this.existPath(_path))) {
                return false;
            }
            Array.from(this._files.keys())
                .filter(filePath => filePath.startsWith(_path))
                .forEach(filePath => this._files.delete(filePath));
            return true;
        });
    }
    readDir(dirPath, params) {
        const files = Array.from(this._files.keys())
            .filter(filePath => filePath.startsWith(dirPath))
            .map(filePath => filePath.slice(dirPath.length))
            .filter(filePath => !filePath.includes('/'));
        return Promise.resolve(files);
    }
}

export { FileControllerMock, fileControllerDefault };
