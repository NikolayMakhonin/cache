import { __awaiter } from 'tslib';
import path from 'path';
import '@flemist/time-limits';
import '@flemist/async-utils';
import '../../common/cache/normalizeObject.mjs';
import '@flemist/time-controller';
import { fileControllerDefault } from './FileController.mjs';
import crypto from 'crypto';
import { readDirRecursive } from './readDirRecursive.mjs';
import { deleteEmptyDirs } from './deleteEmptyDirs.mjs';
import 'fs';
import 'os';
import '@rollup/pluginutils';
import './getStackTrace.mjs';

function checkExist({ fileController, filePath, hashFilePath, deleteIfCorrupted, }) {
    return __awaiter(this, void 0, void 0, function* () {
        const [existHash, existFile] = yield Promise.all([
            hashFilePath && fileController.existPath(hashFilePath),
            fileController.existPath(filePath),
        ]);
        if (!hashFilePath) {
            return existFile;
        }
        if (!!existFile === !!existHash) {
            return existFile;
        }
        if (deleteIfCorrupted) {
            console.warn(`Incorrect hash. Files deleted:\r\n${filePath}\r\n${hashFilePath}`);
            yield Promise.all([
                fileController.deletePath(hashFilePath),
                fileController.deletePath(filePath),
            ]);
        }
        else {
            console.warn(`Incorrect hash:\r\n${filePath}\r\n${hashFilePath}`);
        }
        return false;
    });
}
function checkHash({ fileController, buffer: _buffer, hashBuffer: _hashBuffer, filePath, hashFilePath, deleteIfCorrupted, }) {
    return __awaiter(this, void 0, void 0, function* () {
        const [buffer, hashBuffer] = yield Promise.all([
            _buffer || fileController.readFile(filePath),
            _hashBuffer || fileController.readFile(hashFilePath),
        ]);
        const hashExpected = hashBuffer == null
            ? null
            : hashBuffer.toString('utf-8');
        const hashActual = buffer == null
            ? null
            : crypto.createHash('sha256').update(buffer).digest('base64url');
        if (hashExpected !== hashActual) {
            if (deleteIfCorrupted) {
                console.warn(`Incorrect hash. Files deleted:\r\n${filePath}\r\n${hashFilePath}`);
                yield Promise.all([
                    fileController.deletePath(hashFilePath),
                    fileController.deletePath(filePath),
                ]);
            }
            else {
                console.warn(`Incorrect hash:\r\n${filePath}\r\n${hashFilePath}`);
            }
            return false;
        }
        return true;
    });
}
class FileMap {
    constructor({ dir, keyPathConverter, valueBufferConverter, fileController, options, }) {
        this._dir = dir;
        this._keyPathConverter = keyPathConverter;
        this._valueBufferConverter = valueBufferConverter;
        this._fileController = fileController || fileControllerDefault;
        this._options = options || {};
    }
    _getFilePath(key) {
        const relativePath = this._keyPathConverter.valueToString(key);
        // protect from save data everywhere except in specified dir
        if (/(?:^|[\\/])[.]+(?:[\\/]|$)/.test(relativePath)) {
            throw new Error(`Disallowed '..' or '.' in path: ${relativePath}`);
        }
        const filePath = path.join(this._dir, relativePath);
        return filePath;
    }
    set(key, value) {
        return __awaiter(this, void 0, void 0, function* () {
            const filePath = this._getFilePath(key);
            const buffer = yield this._valueBufferConverter.valueToBuffer(value);
            let hashFilePath;
            let hashBuffer;
            if (this._options.useHash) {
                hashFilePath = filePath + '.hash';
                const hash = crypto.createHash('sha256').update(buffer).digest('base64url');
                hashBuffer = Buffer.from(hash, 'utf-8');
            }
            yield Promise.all([
                hashFilePath && this._fileController.writeFile(hashFilePath, hashBuffer),
                this._fileController.writeFile(filePath, buffer),
            ]);
        });
    }
    get(key) {
        return __awaiter(this, void 0, void 0, function* () {
            const filePath = this._getFilePath(key);
            const hashFilePath = this._options.useHash
                ? filePath + '.hash'
                : null;
            if (!(yield checkExist({
                fileController: this._fileController,
                filePath,
                hashFilePath,
                deleteIfCorrupted: this._options.deleteIfCorrupted,
            }))) {
                yield deleteEmptyDirs(this._fileController, this._dir, filePath);
                return void 0;
            }
            const [hashBuffer, buffer] = yield Promise.all([
                hashFilePath && this._fileController.readFile(hashFilePath, { dontThrowIfNotExist: true }),
                this._fileController.readFile(filePath, { dontThrowIfNotExist: true }),
            ]);
            if ((!hashFilePath || hashBuffer == null) && buffer == null) {
                return void 0;
            }
            if (hashFilePath && !(yield checkHash({
                fileController: this._fileController,
                buffer,
                hashBuffer,
                filePath,
                hashFilePath,
                deleteIfCorrupted: this._options.deleteIfCorrupted,
            }))) {
                yield deleteEmptyDirs(this._fileController, this._dir, filePath);
                return void 0;
            }
            const value = yield this._valueBufferConverter.bufferToValue(buffer);
            return value;
        });
    }
    delete(key) {
        return __awaiter(this, void 0, void 0, function* () {
            const filePath = this._getFilePath(key);
            const hashFilePath = filePath + '.hash';
            yield Promise.all([
                this._fileController.deletePath(hashFilePath),
                this._fileController.deletePath(filePath),
            ]);
            yield deleteEmptyDirs(this._fileController, this._dir, filePath);
        });
    }
    _has(key, _checkHash) {
        return __awaiter(this, void 0, void 0, function* () {
            const filePath = this._getFilePath(key);
            const hashFilePath = this._options.useHash
                ? filePath + '.hash'
                : null;
            if (!(yield checkExist({
                fileController: this._fileController,
                filePath,
                hashFilePath,
                deleteIfCorrupted: this._options.deleteIfCorrupted,
            }))) {
                yield deleteEmptyDirs(this._fileController, this._dir, filePath);
                return false;
            }
            if (_checkHash && hashFilePath && !(yield checkHash({
                fileController: this._fileController,
                filePath,
                hashFilePath,
                deleteIfCorrupted: this._options.deleteIfCorrupted,
            }))) {
                yield deleteEmptyDirs(this._fileController, this._dir, filePath);
                return false;
            }
            return true;
        });
    }
    hasKey(key) {
        return __awaiter(this, void 0, void 0, function* () {
            return this._has(key, false);
        });
    }
    hasValue(key) {
        return __awaiter(this, void 0, void 0, function* () {
            return this._has(key, true);
        });
    }
    keys() {
        return __awaiter(this, void 0, void 0, function* () {
            const pathWithStats = yield readDirRecursive(this._fileController, this._dir);
            const keys = [];
            for (let i = 0, len = pathWithStats.length; i < len; i++) {
                const pathWithStat = pathWithStats[i];
                if (pathWithStat.stat.isDirectory
                    || pathWithStat.path.endsWith('.hash')) {
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
