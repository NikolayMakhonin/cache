'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var tslib = require('tslib');
var asyncUtils = require('@flemist/async-utils');
var timeController = require('@flemist/time-controller');

function createMemCacheStrategy({ lifeTime, updateInterval, timeController: timeController$1, }) {
    if (!timeController$1) {
        timeController$1 = timeController.timeControllerDefault;
    }
    const cache = new Map();
    return function memCacheStrategy(func, key, lock) {
        return tslib.__awaiter(this, void 0, void 0, function* () {
            let cacheItem = cache.get(key);
            function process() {
                return tslib.__awaiter(this, void 0, void 0, function* () {
                    const state = asyncUtils.isPromiseLike(cacheItem.value)
                        ? yield cacheItem.value
                        : cacheItem.value;
                    cacheItem.options.dateRequest = timeController$1.now();
                    while (true) {
                        if (!state.hasValue) {
                            cache.delete(key);
                            break;
                        }
                        if (updateInterval) {
                            yield asyncUtils.delay(updateInterval, null, timeController$1);
                            if (timeController$1.now() - cacheItem.options.dateRequest > lifeTime) {
                                cache.delete(key);
                                break;
                            }
                            yield func(state);
                        }
                        else {
                            yield asyncUtils.delay(lifeTime, null, timeController$1);
                            cache.delete(key);
                            break;
                        }
                    }
                });
            }
            if (!cacheItem) {
                cacheItem = {
                    value: func(),
                    options: {
                        dateCreated: timeController$1.now(),
                        dateRequest: timeController$1.now(),
                    },
                };
                cache.set(key, cacheItem);
                void process();
            }
            const state = asyncUtils.isPromiseLike(cacheItem.value)
                ? yield cacheItem.value
                : cacheItem.value;
            cacheItem.options.dateRequest = timeController$1.now();
            if (!state.hasValue) {
                throw state.error || new Error(`state.error = ${state.error}`);
            }
            return state.value;
        });
    };
}

exports.createMemCacheStrategy = createMemCacheStrategy;
