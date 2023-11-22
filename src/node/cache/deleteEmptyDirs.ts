import path from 'path'
import {IFileController} from 'src/node'

export async function deleteEmptyDirs(
  fileController: IFileController,
  rootDir: string,
  deleteDir: string,
): Promise<void> {
  rootDir = path.resolve(rootDir)
  deleteDir = path.resolve(deleteDir)

  // const isSubDir = deleteDir.startsWith(rootDir)
  while (deleteDir.startsWith(rootDir)) {
    const stat = await fileController.getStat(deleteDir, {dontThrowIfNotExist: true})
    if (stat?.isDirectory) {
      const paths = await fileController.readDir(deleteDir, {dontThrowIfNotExist: true})
      if (paths?.length) {
        break
      }
      await fileController.deletePath(deleteDir)
    }
    deleteDir = path.dirname(deleteDir)
  }
}
