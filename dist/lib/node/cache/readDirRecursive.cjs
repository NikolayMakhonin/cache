'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var tslib = require('tslib');
var path = require('path');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var path__default = /*#__PURE__*/_interopDefaultLegacy(path);

function readDirRecursive(fileController, dirPath) {
    function readDirRecursiveInner(fileController, dirPath, dirPathRelative) {
        var _a;
        return tslib.__awaiter(this, void 0, void 0, function* () {
            const paths = (_a = yield fileController.readDir(dirPath, { dontThrowIfNotExist: true })) !== null && _a !== void 0 ? _a : [];
            const result = [];
            for (const _path of paths) {
                const filePath = path__default["default"].join(dirPath, _path);
                const stat = yield fileController.getStat(filePath, { dontThrowIfNotExist: true });
                if (stat) {
                    const pathRelative = path__default["default"].join(dirPathRelative, _path);
                    result.push({
                        path: pathRelative.replace(/\\/g, '/'),
                        stat,
                    });
                    if (stat.isDirectory) {
                        result.push(...yield readDirRecursiveInner(fileController, filePath, pathRelative));
                    }
                }
            }
            return result;
        });
    }
    return readDirRecursiveInner(fileController, dirPath, '');
}

exports.readDirRecursive = readDirRecursive;
