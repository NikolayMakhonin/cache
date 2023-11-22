'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var tslib = require('tslib');
var path = require('path');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var path__default = /*#__PURE__*/_interopDefaultLegacy(path);

function deleteEmptyDirs(fileController, rootDir, deleteDir) {
    return tslib.__awaiter(this, void 0, void 0, function* () {
        rootDir = path__default["default"].resolve(rootDir);
        deleteDir = path__default["default"].resolve(deleteDir);
        // const isSubDir = deleteDir.startsWith(rootDir)
        while (deleteDir.startsWith(rootDir)) {
            const stat = yield fileController.getStat(deleteDir, { dontThrowIfNotExist: true });
            if (stat === null || stat === void 0 ? void 0 : stat.isDirectory) {
                const paths = yield fileController.readDir(deleteDir, { dontThrowIfNotExist: true });
                if (paths === null || paths === void 0 ? void 0 : paths.length) {
                    break;
                }
                yield fileController.deletePath(deleteDir);
            }
            deleteDir = path__default["default"].dirname(deleteDir);
        }
    });
}

exports.deleteEmptyDirs = deleteEmptyDirs;
