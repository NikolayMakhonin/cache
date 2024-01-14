'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var common_cache_normalizeObject = require('./normalizeObject.cjs');

function getJsonKeyFunc(params = {}) {
    return function getJsonKey(obj) {
        obj = common_cache_normalizeObject.normalizeObject(obj, params);
        return JSON.stringify(obj !== null && obj !== void 0 ? obj : null);
    };
}

exports.getJsonKeyFunc = getJsonKeyFunc;
