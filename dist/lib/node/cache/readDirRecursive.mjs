import { __awaiter } from 'tslib';
import path from 'path';

function readDirRecursive(fileController, dirPath) {
    function readDirRecursiveInner(fileController, dirPath, dirPathRelative) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const paths = (_a = yield fileController.readDir(dirPath, { dontThrowIfNotExist: true })) !== null && _a !== void 0 ? _a : [];
            const result = [];
            for (const _path of paths) {
                const filePath = path.join(dirPath, _path);
                const stat = yield fileController.getStat(filePath, { dontThrowIfNotExist: true });
                if (stat) {
                    const pathRelative = path.join(dirPathRelative, _path);
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

export { readDirRecursive };
