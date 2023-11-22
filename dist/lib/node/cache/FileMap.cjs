'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var tslib = require('tslib');
var path = require('path');
require('@flemist/time-limits');
require('@flemist/async-utils');
require('@flemist/time-controller');
var node_cache_FileController = require('./FileController.cjs');
require('crypto');
var node_cache_readDirRecursive = require('./readDirRecursive.cjs');
var node_cache_deleteEmptyDirs = require('./deleteEmptyDirs.cjs');
require('fs');
require('os');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var path__default = /*#__PURE__*/_interopDefaultLegacy(path);

class FileMap {
    constructor({ dir, keyPathConverter, valueBufferConverter, fileController, }) {
        this._dir = dir;
        this._keyPathConverter = keyPathConverter;
        this._valueBufferConverter = valueBufferConverter;
        this._fileController = fileController || node_cache_FileController.fileControllerDefault;
    }
    _getFilePath(key) {
        const relativePath = this._keyPathConverter.valueToString(key);
        // protect from save data everywhere except in specified dir
        if (/(?:^|[\\/])[.]+(?:[\\/]|$)/.test(relativePath)) {
            throw new Error(`Disallowed '..' or '.' in path: ${relativePath}`);
        }
        const filePath = path__default["default"].join(this._dir, this._keyPathConverter.valueToString(key));
        return filePath;
    }
    set(key, value) {
        return tslib.__awaiter(this, void 0, void 0, function* () {
            const filePath = this._getFilePath(key);
            const buffer = yield this._valueBufferConverter.valueToBuffer(value);
            yield this._fileController.writeFile(filePath, buffer);
        });
    }
    get(key) {
        return tslib.__awaiter(this, void 0, void 0, function* () {
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
        return tslib.__awaiter(this, void 0, void 0, function* () {
            const filePath = this._getFilePath(key);
            yield this._fileController.deletePath(filePath);
            yield node_cache_deleteEmptyDirs.deleteEmptyDirs(this._fileController, this._dir, filePath);
        });
    }
    has(key) {
        return tslib.__awaiter(this, void 0, void 0, function* () {
            const filePath = this._getFilePath(key);
            return this._fileController.existPath(filePath);
        });
    }
    keys() {
        return tslib.__awaiter(this, void 0, void 0, function* () {
            const pathWithStats = yield node_cache_readDirRecursive.readDirRecursive(this._fileController, this._dir);
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
        return tslib.__awaiter(this, void 0, void 0, function* () {
            yield this._fileController.deletePath(this._dir);
        });
    }
}

exports.FileMap = FileMap;
