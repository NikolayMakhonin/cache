import { __awaiter } from 'tslib';
import path from 'path';

function deleteEmptyDirs(fileController, rootDir, deleteDir) {
    return __awaiter(this, void 0, void 0, function* () {
        rootDir = path.resolve(rootDir);
        deleteDir = path.resolve(deleteDir);
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
            deleteDir = path.dirname(deleteDir);
        }
    });
}

export { deleteEmptyDirs };
