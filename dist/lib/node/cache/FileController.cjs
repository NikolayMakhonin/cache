'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var tslib = require('tslib');
var fs = require('fs');
var path = require('path');
var timeLimits = require('@flemist/time-limits');
var os = require('os');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

function _interopNamespace(e) {
    if (e && e.__esModule) return e;
    var n = Object.create(null);
    if (e) {
        Object.keys(e).forEach(function (k) {
            if (k !== 'default') {
                var d = Object.getOwnPropertyDescriptor(e, k);
                Object.defineProperty(n, k, d.get ? d : {
                    enumerable: true,
                    get: function () { return e[k]; }
                });
            }
        });
    }
    n["default"] = e;
    return Object.freeze(n);
}

var fs__default = /*#__PURE__*/_interopDefaultLegacy(fs);
var path__default = /*#__PURE__*/_interopDefaultLegacy(path);
var os__namespace = /*#__PURE__*/_interopNamespace(os);

const filePool = new timeLimits.Pool(Math.min(os__namespace.cpus().length, 100));
const fileControllerDefault = {
    existPath(_path) {
        return fs__default["default"].promises.stat(_path).catch(() => null);
    },
    readFile(filePath) {
        return timeLimits.poolRunWait({
            pool: filePool,
            count: 1,
            func: () => fs__default["default"].promises.readFile(filePath),
        });
    },
    writeFile(filePath, data) {
        return tslib.__awaiter(this, void 0, void 0, function* () {
            filePath = path__default["default"].resolve(filePath);
            const dir = path__default["default"].dirname(filePath);
            yield timeLimits.poolRunWait({
                pool: filePool,
                count: 1,
                func: () => tslib.__awaiter(this, void 0, void 0, function* () {
                    if (!(yield fs__default["default"].promises.stat(dir).catch(() => null))) {
                        yield fs__default["default"].promises.mkdir(dir, { recursive: true });
                    }
                    yield fs__default["default"].promises.writeFile(filePath, data);
                }),
            });
        });
    },
    getStat(filePath) {
        return tslib.__awaiter(this, void 0, void 0, function* () {
            const stat = yield fs__default["default"].promises.stat(filePath);
            return {
                size: stat.size,
                dateCreated: Math.min(stat.birthtimeMs, stat.mtimeMs),
                dateModified: stat.mtimeMs,
            };
        });
    },
    deletePath(_path) {
        return tslib.__awaiter(this, void 0, void 0, function* () {
            if (!this.existPath(_path)) {
                return false;
            }
            yield fs__default["default"].promises.rm(_path, { recursive: true, force: true });
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

exports.FileControllerMock = FileControllerMock;
exports.fileControllerDefault = fileControllerDefault;
