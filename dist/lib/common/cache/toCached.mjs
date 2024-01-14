import { __awaiter } from 'tslib';
import { Pool, poolRunWait } from '@flemist/time-limits';
import { isPromiseLike, createValueState } from '@flemist/async-utils';

function toCached(func, { getKey, strategy, }) {
    const lockers = new Map();
    return function cached(...args) {
        return __awaiter(this, void 0, void 0, function* () {
            let key = getKey.apply(this, args);
            if (isPromiseLike(key)) {
                // eslint-disable-next-line require-atomic-updates
                key = yield key;
            }
            let locker = lockers.get(key);
            if (!locker) {
                const pool = new Pool(1);
                const lock = (func) => poolRunWait({
                    pool,
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
            const _func = (state) => __awaiter(this, void 0, void 0, function* () {
                if (!state) {
                    state = createValueState();
                }
                try {
                    state.loading = true;
                    let value = func.apply(this, args);
                    if (isPromiseLike(value)) {
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

export { toCached };
