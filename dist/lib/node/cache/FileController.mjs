import { __awaiter } from 'tslib';
import fs from 'fs';
import path from 'path';
import { Pool, poolRunWait } from '@flemist/time-limits';
import * as os from 'os';

const filePool = new Pool(Math.min(os.cpus().length, 100));
const fileControllerDefault = {
    existPath(_path) {
        return fs.promises.stat(_path).catch(() => null);
    },
    readFile(filePath) {
        return poolRunWait({
            pool: filePool,
            count: 1,
            func: () => fs.promises.readFile(filePath),
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
                    if (!(yield fs.promises.stat(dir).catch(() => null))) {
                        yield fs.promises.mkdir(dir, { recursive: true });
                    }
                    yield fs.promises.writeFile(filePath, data);
                }),
            });
        });
    },
    getStat(filePath) {
        return __awaiter(this, void 0, void 0, function* () {
            const stat = yield fs.promises.stat(filePath);
            return {
                size: stat.size,
                dateCreated: Math.min(stat.birthtimeMs, stat.mtimeMs),
                dateModified: stat.mtimeMs,
            };
        });
    },
    deletePath(_path) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.existPath(_path)) {
                return false;
            }
            yield fs.promises.rm(_path, { recursive: true, force: true });
            return true;
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
    readFile(filePath) {
        var _a;
        if (!this._files.has(filePath)) {
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
                size: data.length,
                dateCreated: (_a = file === null || file === void 0 ? void 0 : file.stat.dateCreated) !== null && _a !== void 0 ? _a : now,
                dateModified: now,
            },
        });
        return Promise.resolve();
    }
    getStat(filePath) {
        var _a;
        if (!this._files.has(filePath)) {
            return Promise.reject(new Error('File is not exist: ' + filePath));
        }
        return Promise.resolve((_a = this._files.get(filePath)) === null || _a === void 0 ? void 0 : _a.stat);
    }
    deletePath(_path) {
        if (!this.existPath(_path)) {
            return Promise.resolve(false);
        }
        this._files.delete(_path);
        return Promise.resolve(true);
    }
}

export { FileControllerMock, fileControllerDefault };
