import { __awaiter } from 'tslib';
import path from 'path';
import '@flemist/time-limits';
import '@flemist/async-utils';
import '@flemist/time-controller';
import { fileControllerDefault } from './FileController.mjs';
import 'crypto';
import { readDirRecursive } from './readDirRecursive.mjs';
import { deleteEmptyDirs } from './deleteEmptyDirs.mjs';
import 'fs';
import 'os';

class FileMap {
    constructor({ dir, keyPathConverter, valueBufferConverter, fileController, }) {
        this._dir = dir;
        this._keyPathConverter = keyPathConverter;
        this._valueBufferConverter = valueBufferConverter;
        this._fileController = fileController || fileControllerDefault;
    }
    _getFilePath(key) {
        const relativePath = this._keyPathConverter.valueToString(key);
        // protect from save data everywhere except in specified dir
        if (/(?:^|[\\/])[.]+(?:[\\/]|$)/.test(relativePath)) {
            throw new Error(`Disallowed '..' or '.' in path: ${relativePath}`);
        }
        const filePath = path.join(this._dir, this._keyPathConverter.valueToString(key));
        return filePath;
    }
    set(key, value) {
        return __awaiter(this, void 0, void 0, function* () {
            const filePath = this._getFilePath(key);
            const buffer = yield this._valueBufferConverter.valueToBuffer(value);
            yield this._fileController.writeFile(filePath, buffer);
        });
    }
    get(key) {
        return __awaiter(this, void 0, void 0, function* () {
            const filePath = this._getFilePath(key);
            if (!(yield this._fileController.existPath(filePath))) {
                return void 0;
            }
            const buffer = yield this._fileController.readFile(filePath, { dontThrowIfNotExist: true });
            if (buffer == null) {
                return void 0;
            }
            const value = yield this._valueBufferConverter.bufferToValue(buffer);
            return value;
        });
    }
    delete(key) {
        return __awaiter(this, void 0, void 0, function* () {
            const filePath = this._getFilePath(key);
            yield this._fileController.deletePath(filePath);
            yield deleteEmptyDirs(this._fileController, this._dir, filePath);
        });
    }
    has(key) {
        return __awaiter(this, void 0, void 0, function* () {
            const filePath = this._getFilePath(key);
            return this._fileController.existPath(filePath);
        });
    }
    keys() {
        return __awaiter(this, void 0, void 0, function* () {
            const pathWithStats = yield readDirRecursive(this._fileController, this._dir);
            const keys = [];
            for (let i = 0, len = pathWithStats.length; i < len; i++) {
                const pathWithStat = pathWithStats[i];
                if (pathWithStat.stat.isDirectory) {
                    continue;
                }
                const key = this._keyPathConverter.stringToValue(pathWithStat.path);
                if (key != null) {
                    keys.push(key);
                }
            }
            return keys;
        });
    }
    clear() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this._fileController.deletePath(this._dir);
        });
    }
}

export { FileMap };
