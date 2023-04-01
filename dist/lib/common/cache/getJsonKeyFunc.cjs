'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function normalizeObject(obj, { sortKeys = true, deep = true, } = {}) {
    if (!obj || typeof obj !== 'object') {
        return obj;
    }
    const keys = Object.keys(obj);
    if (sortKeys) {
        keys.sort();
    }
    return keys.reduce((a, key) => {
        const value = obj[key];
        if (value != null && value !== '') {
            a[key] = value;
        }
        return a;
    }, {});
}
function getJsonKeyFunc(params = {}) {
    return function getJsonKey(obj) {
        obj = normalizeObject(obj);
        return JSON.stringify(obj !== null && obj !== void 0 ? obj : null);
    };
}

exports.getJsonKeyFunc = getJsonKeyFunc;
