'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var tslib = require('tslib');
var path = require('path');
var node_cache_FileController = require('./FileController.cjs');
var crypto = require('crypto');
require('fs');
require('@flemist/time-limits');
require('os');
require('@rollup/pluginutils');
require('./getStackTrace.cjs');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var path__default = /*#__PURE__*/_interopDefaultLegacy(path);
var crypto__default = /*#__PURE__*/_interopDefaultLegacy(crypto);

// function hashToPathOld(hash: string) {
//   return hash.substring(0, 2)
//     + '/' + hash.substring(2, 4)
//     + '/' + hash.substring(4, 6)
//     + '/' + hash.substring(6)
// }
function hashToPath(hash) {
    return hash.substring(0, 2)
        + '/' + hash.substring(2);
}
function createFileCacheStrategy({ dir, converter, filterArgs, filterResult, fileController, isExpired, checkHash, }) {
    if (!fileController) {
        fileController = node_cache_FileController.fileControllerDefault;
    }
    return function fileCacheStrategy(func, key, lock, _this, args) {
        return tslib.__awaiter(this, void 0, void 0, function* () {
            return lock(() => tslib.__awaiter(this, void 0, void 0, function* () {
                let state;
                if (filterArgs && !(yield filterArgs.call(_this, args))) {
                    state = yield func();
                }
                else {
                    let cacheItem;
                    const cacheItemFilePath = path__default["default"].resolve(dir, hashToPath(key + '_meta'));
                    // const cacheItemFilePathOld = path.resolve(dir, hashToPathOld(key + '_meta'))
                    // if (await fileController.existPath(cacheItemFilePathOld)) {
                    //   const dir = path.dirname(cacheItemFilePath)
                    //   if (!await fs.promises.stat(dir).catch(() => null)) {
                    //     await fs.promises.mkdir(dir, {recursive: true})
                    //   }
                    //   await fs.promises.rename(cacheItemFilePathOld, cacheItemFilePath)
                    // }
                    const cacheItemFileStat = yield fileController.getStat(cacheItemFilePath).catch(() => null);
                    if (cacheItemFileStat) {
                        const cacheItemBuffer = yield fileController.readFile(cacheItemFilePath);
                        const cacheItemStr = cacheItemBuffer === null || cacheItemBuffer === void 0 ? void 0 : cacheItemBuffer.toString('utf-8');
                        if (cacheItemStr) {
                            try {
                                cacheItem = JSON.parse(cacheItemStr);
                            }
                            catch (err) {
                                console.warn('Error parse cacheItem for: ' + key);
                            }
                        }
                        if (cacheItem) {
                            state = cacheItem.value;
                            if (state.hasValue) {
                                const valueFilePath = path__default["default"].resolve(dir, hashToPath(cacheItem.options.hash));
                                // const valueFilePathOld = path.resolve(dir, hashToPathOld(cacheItem.options.hash))
                                // if (await fileController.existPath(valueFilePathOld)) {
                                //   const dir = path.dirname(valueFilePath)
                                //   if (!await fs.promises.stat(dir).catch(() => null)) {
                                //     await fs.promises.mkdir(dir, {recursive: true})
                                //   }
                                //   await fs.promises.rename(valueFilePathOld, valueFilePath)
                                // }
                                const valueFileStat = yield fileController.getStat(valueFilePath).catch(() => null);
                                if (!valueFileStat) {
                                    console.warn('Value file not found: ' + valueFilePath);
                                    cacheItem = null;
                                    state = null;
                                }
                                else {
                                    const valueBuffer = yield fileController.readFile(valueFilePath);
                                    const _checkHash = checkHash && crypto__default["default"].createHash('sha256').update(valueBuffer).digest('base64url');
                                    if (checkHash && _checkHash !== cacheItem.options.hash) {
                                        console.warn('Incorrect hash for: ' + key);
                                        yield fileController.deletePath(valueFilePath);
                                        cacheItem = null;
                                        state = null;
                                    }
                                    else {
                                        state.value = yield converter.bufferToValue(valueBuffer);
                                        if (isExpired && (yield isExpired.call(_this, state, args, valueFileStat))) {
                                            console.log('Expired cacheItem for: ' + key);
                                            yield fileController.deletePath(valueFilePath);
                                            cacheItem = null;
                                            state = null;
                                        }
                                    }
                                }
                            }
                            else if (isExpired && (yield isExpired.call(_this, state, args, cacheItemFileStat))) {
                                console.log('Expired cacheItem for: ' + key);
                                yield fileController.deletePath(cacheItemFilePath);
                                cacheItem = null;
                                state = null;
                            }
                        }
                    }
                    if (!state) {
                        state = yield func();
                        if (!filterResult || filterResult.call(_this, state, args)) {
                            const valueBuffer = state.hasValue ? yield converter.valueToBuffer(state.value) : null;
                            const hash = valueBuffer && crypto__default["default"].createHash('sha256').update(valueBuffer).digest('base64url');
                            const valueFilePath = hash && path__default["default"].resolve(dir, hashToPath(hash));
                            cacheItem = {
                                value: Object.assign(Object.assign({}, state), { value: void 0 }),
                                options: {
                                    hash,
                                },
                            };
                            const cacheItemStr = JSON.stringify(cacheItem, null, 2);
                            const cacheItemBuffer = cacheItemStr && Buffer.from(cacheItemStr, 'utf-8');
                            yield Promise.all([
                                cacheItemBuffer && fileController.writeFile(cacheItemFilePath, cacheItemBuffer),
                                valueBuffer && fileController.writeFile(valueFilePath, valueBuffer),
                            ]);
                        }
                    }
                }
                if (!state.hasValue) {
                    throw state.error || new Error(`state.error = ${state.error}`);
                }
                return state.value;
            }));
        });
    };
}

exports.createFileCacheStrategy = createFileCacheStrategy;
