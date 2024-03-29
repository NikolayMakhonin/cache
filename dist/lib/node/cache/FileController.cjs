'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var tslib = require('tslib');
var fs = require('fs');
var path = require('path');
var timeLimits = require('@flemist/time-limits');
var os = require('os');
var pluginutils = require('@rollup/pluginutils');
var node_cache_getStackTrace = require('./getStackTrace.cjs');

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
const _lockPathMap = new Map();
function lockPaths(_paths, func) {
    return tslib.__awaiter(this, void 0, void 0, function* () {
        const normalizedPaths = Array.from(new Set(_paths.map(pluginutils.normalizePath).filter(o => o)));
        const locks = normalizedPaths.map(path => {
            let lock = _lockPathMap.get(path);
            if (!lock) {
                lock = {
                    pool: new timeLimits.Pool(1),
                    count: 0,
                    path,
                };
                _lockPathMap.set(path, lock);
            }
            return lock;
        });
        locks.forEach(pool => pool.count++);
        const pools = new timeLimits.Pools(...locks.map(o => o.pool));
        return timeLimits.poolRunWait({
            pool: pools,
            count: 1,
            func() {
                return tslib.__awaiter(this, void 0, void 0, function* () {
                    try {
                        return yield func();
                    }
                    finally {
                        locks.forEach(pool => pool.count--);
                        locks.forEach(pool => {
                            if (pool.count <= 0) {
                                _lockPathMap.delete(pool.path);
                            }
                        });
                    }
                });
            },
        });
    });
}
const TEMP_EXT = `.${Math.random().toString(36).slice(2)}.tmp`;
const fileControllerDefault = {
    existPath(_path) {
        return tslib.__awaiter(this, void 0, void 0, function* () {
            if (!_path) {
                return false;
            }
            const stack = node_cache_getStackTrace.getStackTrace();
            try {
                return !!(yield fs__default["default"].promises.stat(_path));
            }
            catch (err) {
                err.stack = err.stack ? err.stack + '\n' + stack : stack;
                if (err.code === 'ENOENT') {
                    return false;
                }
                throw err;
            }
        });
    },
    readFile(filePath, params) {
        if (!filePath) {
            if (params === null || params === void 0 ? void 0 : params.dontThrowIfNotExist) {
                return Promise.resolve(void 0);
            }
            return Promise.reject(new Error('File path is empty'));
        }
        const stack = node_cache_getStackTrace.getStackTrace();
        return timeLimits.poolRunWait({
            pool: filePool,
            count: 1,
            func: () => fs__default["default"].promises.readFile(filePath).catch(err => {
                err.stack = err.stack ? err.stack + '\n' + stack : stack;
                if ((params === null || params === void 0 ? void 0 : params.dontThrowIfNotExist) && err.code === 'ENOENT') {
                    return void 0;
                }
                throw err;
            }),
        });
    },
    writeFile(filePath, data) {
        return tslib.__awaiter(this, void 0, void 0, function* () {
            filePath = path__default["default"].resolve(filePath);
            const dir = path__default["default"].dirname(filePath);
            const stack = node_cache_getStackTrace.getStackTrace();
            yield timeLimits.poolRunWait({
                pool: filePool,
                count: 1,
                func: () => tslib.__awaiter(this, void 0, void 0, function* () {
                    if (!(yield this.existPath(dir))) {
                        try {
                            yield fs__default["default"].promises.mkdir(dir, { recursive: true });
                        }
                        catch (err) {
                            err.stack = err.stack ? err.stack + '\n' + stack : stack;
                            if (err.code !== 'EEXIST') {
                                throw err;
                            }
                        }
                    }
                    try {
                        yield fs__default["default"].promises.writeFile(filePath + TEMP_EXT, data);
                        yield fs__default["default"].promises.rm(filePath, { force: true });
                        yield fs__default["default"].promises.rename(filePath + TEMP_EXT, filePath);
                    }
                    catch (err) {
                        err.stack = err.stack ? err.stack + '\n' + stack : stack;
                        throw err;
                    }
                }),
            });
        });
    },
    getStat(filePath, params) {
        return tslib.__awaiter(this, void 0, void 0, function* () {
            if (!filePath) {
                if (params === null || params === void 0 ? void 0 : params.dontThrowIfNotExist) {
                    return Promise.resolve(void 0);
                }
                return Promise.reject(new Error('File path is empty'));
            }
            const stack = node_cache_getStackTrace.getStackTrace();
            const stat = yield fs__default["default"].promises.stat(filePath).catch((err) => {
                err.stack = err.stack ? err.stack + '\n' + stack : stack;
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
        return tslib.__awaiter(this, void 0, void 0, function* () {
            if (!_path || !(yield this.existPath(_path))) {
                return false;
            }
            const stack = node_cache_getStackTrace.getStackTrace();
            yield fs__default["default"].promises.rm(_path, { recursive: true, force: true }).catch(err => {
                err.stack = err.stack ? err.stack + '\n' + stack : stack;
                if (err.code === 'ENOENT') {
                    return null;
                }
                throw err;
            });
            return true;
        });
    },
    readDir(dirPath, params) {
        const stack = node_cache_getStackTrace.getStackTrace();
        return timeLimits.poolRunWait({
            pool: filePool,
            count: 1,
            func: () => fs__default["default"].promises.readdir(dirPath).catch(err => {
                err.stack = err.stack ? err.stack + '\n' + stack : stack;
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
        return tslib.__awaiter(this, void 0, void 0, function* () {
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

exports.FileControllerMock = FileControllerMock;
exports.fileControllerDefault = fileControllerDefault;
exports.lockPaths = lockPaths;
