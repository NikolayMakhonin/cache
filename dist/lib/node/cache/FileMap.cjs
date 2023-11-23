'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var tslib = require('tslib');
var path = require('path');
require('@flemist/time-limits');
require('@flemist/async-utils');
require('@flemist/time-controller');
var node_cache_FileController = require('./FileController.cjs');
var crypto = require('crypto');
var node_cache_readDirRecursive = require('./readDirRecursive.cjs');
var node_cache_deleteEmptyDirs = require('./deleteEmptyDirs.cjs');
require('fs');
require('os');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var path__default = /*#__PURE__*/_interopDefaultLegacy(path);
var crypto__default = /*#__PURE__*/_interopDefaultLegacy(crypto);

function checkHash({ fileController, buffer: _buffer, hashBuffer: _hashBuffer, filePath, hashFilePath, deleteIfHashIncorrect, }) {
    return tslib.__awaiter(this, void 0, void 0, function* () {
        const [buffer, hashBuffer] = yield Promise.all([
            _buffer || fileController.readFile(filePath),
            _hashBuffer || fileController.readFile(hashFilePath),
        ]);
        const hashExpected = hashBuffer.toString('utf-8');
        const hashActual = crypto__default["default"].createHash('sha256').update(buffer).digest('base64url');
        if (hashExpected !== hashActual) {
            if (deleteIfHashIncorrect) {
                yield Promise.all([
                    fileController.deletePath(hashFilePath),
                    fileController.deletePath(filePath),
                ]);
                console.warn(`Incorrect hash. Files deleted:\r\n${filePath}\r\n${hashFilePath}`);
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
        this._fileController = fileController || node_cache_FileController.fileControllerDefault;
        this._options = options || {};
    }
    _getFilePath(key) {
        const relativePath = this._keyPathConverter.valueToString(key);
        // protect from save data everywhere except in specified dir
        if (/(?:^|[\\/])[.]+(?:[\\/]|$)/.test(relativePath)) {
            throw new Error(`Disallowed '..' or '.' in path: ${relativePath}`);
        }
        const filePath = path__default["default"].join(this._dir, relativePath);
        return filePath;
    }
    set(key, value) {
        return tslib.__awaiter(this, void 0, void 0, function* () {
            const filePath = this._getFilePath(key);
            const buffer = yield this._valueBufferConverter.valueToBuffer(value);
            let hashFilePath;
            let hashBuffer;
            if (this._options.useHash) {
                hashFilePath = filePath + '.hash';
                const hash = crypto__default["default"].createHash('sha256').update(buffer).digest('base64url');
                hashBuffer = Buffer.from(hash, 'utf-8');
            }
            yield Promise.all([
                hashFilePath && this._fileController.writeFile(hashFilePath, hashBuffer),
                this._fileController.writeFile(filePath, buffer),
            ]);
        });
    }
    get(key) {
        return tslib.__awaiter(this, void 0, void 0, function* () {
            const filePath = this._getFilePath(key);
            const hashFilePath = this._options.useHash
                ? filePath + '.hash'
                : null;
            const exist = yield Promise.all([
                hashFilePath && this._fileController.existPath(hashFilePath),
                this._fileController.existPath(filePath),
            ]);
            if (hashFilePath && !exist[0] || !exist[1]) {
                return void 0;
            }
            const [hashBuffer, buffer] = yield Promise.all([
                hashFilePath && this._fileController.readFile(hashFilePath, { dontThrowIfNotExist: true }),
                this._fileController.readFile(filePath, { dontThrowIfNotExist: true }),
            ]);
            if (hashFilePath && hashBuffer == null || buffer == null) {
                return void 0;
            }
            if (hashFilePath && !(yield checkHash({
                fileController: this._fileController,
                buffer,
                hashBuffer,
                filePath,
                hashFilePath,
                deleteIfHashIncorrect: this._options.deleteIfHashIncorrect,
            }))) {
                return void 0;
            }
            const value = yield this._valueBufferConverter.bufferToValue(buffer);
            return value;
        });
    }
    delete(key) {
        return tslib.__awaiter(this, void 0, void 0, function* () {
            const filePath = this._getFilePath(key);
            const hashFilePath = filePath + '.hash';
            yield Promise.all([
                this._fileController.deletePath(hashFilePath),
                this._fileController.deletePath(filePath),
            ]);
            yield node_cache_deleteEmptyDirs.deleteEmptyDirs(this._fileController, this._dir, filePath);
        });
    }
    _has(key, _checkHash) {
        return tslib.__awaiter(this, void 0, void 0, function* () {
            const filePath = this._getFilePath(key);
            const hashFilePath = this._options.useHash
                ? filePath + '.hash'
                : null;
            const exist = yield Promise.all([
                hashFilePath && this._fileController.existPath(hashFilePath),
                this._fileController.existPath(filePath),
            ]);
            if (hashFilePath && !exist[0] || !exist[1]) {
                return false;
            }
            if (_checkHash && hashFilePath && !(yield checkHash({
                fileController: this._fileController,
                filePath,
                hashFilePath,
                deleteIfHashIncorrect: this._options.deleteIfHashIncorrect,
            }))) {
                return false;
            }
            return true;
        });
    }
    hasKey(key) {
        return tslib.__awaiter(this, void 0, void 0, function* () {
            return this._has(key, false);
        });
    }
    hasValue(key) {
        return tslib.__awaiter(this, void 0, void 0, function* () {
            return this._has(key, true);
        });
    }
    keys() {
        return tslib.__awaiter(this, void 0, void 0, function* () {
            const pathWithStats = yield node_cache_readDirRecursive.readDirRecursive(this._fileController, this._dir);
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
        return tslib.__awaiter(this, void 0, void 0, function* () {
            yield this._fileController.deletePath(this._dir);
        });
    }
}

exports.FileMap = FileMap;
