import { normalizeObject } from './normalizeObject.mjs';

function getJsonKeyFunc(params = {}) {
    return function getJsonKey(obj) {
        obj = normalizeObject(obj, params);
        return JSON.stringify(obj !== null && obj !== void 0 ? obj : null);
    };
}

export { getJsonKeyFunc };
