'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var tslib = require('tslib');
var timeLimits = require('@flemist/time-limits');
var asyncUtils = require('@flemist/async-utils');

function toCached(func, { getKey, strategy, }) {
    const lockers = new Map();
    return function cached(...args) {
        return tslib.__awaiter(this, void 0, void 0, function* () {
            let key = getKey.apply(this, args);
            if (asyncUtils.isPromiseLike(key)) {
                // eslint-disable-next-line require-atomic-updates
                key = yield key;
            }
            let locker = lockers.get(key);
            if (!locker) {
                const lock = (func) => timeLimits.poolRunWait({
                    pool: new timeLimits.Pool(1),
                    count: 1,
                    func,
                });
                locker = {
                    lock,
                    count: 1,
                };
                lockers.set(key, locker);
            }
            else {
                locker.count++;
            }
            const _func = (state) => tslib.__awaiter(this, void 0, void 0, function* () {
                if (!state) {
                    state = asyncUtils.createValueState();
                }
                try {
                    state.loading = true;
                    let value = func.apply(this, args);
                    if (asyncUtils.isPromiseLike(value)) {
                        value = yield value;
                    }
                    state.value = value;
                    state.hasValue = true;
                    state.hasError = false;
                }
                catch (err) {
                    state.error = err;
                    state.hasError = true;
                }
                finally {
                    state.loading = false;
                }
                return state;
            });
            try {
                const result = yield strategy(_func, key, locker.lock, this, args);
                return result;
            }
            finally {
                locker.count--;
                if (locker.count === 0) {
                    lockers.delete(key);
                }
            }
        });
    };
}

exports.toCached = toCached;
