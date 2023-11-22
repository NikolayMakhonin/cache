import { __awaiter } from 'tslib';
import { isPromiseLike, delay } from '@flemist/async-utils';
import { timeControllerDefault } from '@flemist/time-controller';

function createMemCacheStrategy({ lifeTime, updateInterval, timeController, }) {
    if (!timeController) {
        timeController = timeControllerDefault;
    }
    const cache = new Map();
    return function memCacheStrategy(func, key, lock) {
        return __awaiter(this, void 0, void 0, function* () {
            let cacheItem = cache.get(key);
            function process() {
                return __awaiter(this, void 0, void 0, function* () {
                    const state = isPromiseLike(cacheItem.value)
                        ? yield cacheItem.value
                        : cacheItem.value;
                    cacheItem.options.dateRequest = timeController.now();
                    while (true) {
                        if (!state.hasValue) {
                            cache.delete(key);
                            break;
                        }
                        if (updateInterval) {
                            yield delay(updateInterval, null, timeController);
                            if (lifeTime != null && timeController.now() - cacheItem.options.dateRequest > lifeTime) {
                                cache.delete(key);
                                break;
                            }
                            yield func(state);
                        }
                        else {
                            if (lifeTime != null) {
                                yield delay(lifeTime, null, timeController);
                            }
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
                        dateCreated: timeController.now(),
                        dateRequest: timeController.now(),
                    },
                };
                cache.set(key, cacheItem);
                void process();
            }
            const state = isPromiseLike(cacheItem.value)
                ? yield cacheItem.value
                : cacheItem.value;
            cacheItem.options.dateRequest = timeController.now();
            if (!state.hasValue) {
                throw state.error || new Error(`state.error = ${state.error}`);
            }
            return state.value;
        });
    };
}

export { createMemCacheStrategy };
