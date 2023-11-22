import path from 'path'
import {IFileController, PathStat} from 'src/node'

export type PathWithStat = {
  path: string
  stat: PathStat
}

export function readDirRecursive(fileController: IFileController, dirPath: string): Promise<PathWithStat[]> {
  async function readDirRecursiveInner(fileController: IFileController, dirPath: string, dirPathRelative: string): Promise<PathWithStat[]> {
    const paths = await fileController.readDir(dirPath, {dontThrowIfNotExist: true}) ?? []
    const result: {
      path: string
      stat: PathStat
    }[] = []
    for (const _path of paths) {
      const filePath = path.join(dirPath, _path)
      const stat = await fileController.getStat(filePath, {dontThrowIfNotExist: true})
      if (stat) {
        const pathRelative = path.join(dirPathRelative, _path)
        result.push({
          path: pathRelative.replace(/\\/g, '/'),
          stat,
        })
        if (stat.isDirectory) {
          result.push(...await readDirRecursiveInner(fileController, filePath, pathRelative))
        }
      }
    }
    return result
  }

  return readDirRecursiveInner(fileController, dirPath, '')
}
