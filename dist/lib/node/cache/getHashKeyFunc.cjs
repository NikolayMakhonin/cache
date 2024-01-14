'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var crypto = require('crypto');
var common_cache_getJsonKeyFunc = require('../../common/cache/getJsonKeyFunc.cjs');
require('../../common/cache/normalizeObject.cjs');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var crypto__default = /*#__PURE__*/_interopDefaultLegacy(crypto);

function getHashKeyFunc(algorithm = 'sha256') {
    const getJsonKey = common_cache_getJsonKeyFunc.getJsonKeyFunc();
    return function getHashKey(obj) {
        const json = getJsonKey(obj);
        return crypto__default["default"].createHash(algorithm).update(json).digest('base64url');
    };
}

exports.getHashKeyFunc = getHashKeyFunc;
