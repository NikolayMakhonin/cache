import fs from 'fs'
import path from 'path'
import {Pool, poolRunWait} from '@flemist/time-limits'
import * as os from 'os'

export type ExistPath = (_path: string) => Promise<boolean>
export type DeletePath = (_path: string) => Promise<boolean>
export type ReadFile = (filePath: string) => Promise<Buffer>
export type WriteFile = (filePath: string, data: Buffer) => Promise<void>
export type FileStat = {
  size: number
  dateCreated: number
  dateModified: number
}
export type GetFileStat = (filePath: string) => Promise<FileStat>

export type IFileController = {
  existPath: ExistPath
  getStat: GetFileStat
  readFile: ReadFile
  writeFile: WriteFile
  deletePath: DeletePath
}

const filePool = new Pool(Math.min(os.cpus().length, 100))

export const fileControllerDefault: IFileController = {
  existPath(_path: string): Promise<boolean> {
    return fs.promises.stat(_path).catch(() => null)
  },

  readFile(filePath: string): Promise<Buffer> {
    return poolRunWait({
      pool : filePool,
      count: 1,
      func : () => fs.promises.readFile(filePath),
    })
  },

  async writeFile(filePath: string, data: Buffer) {
    filePath = path.resolve(filePath)
    const dir = path.dirname(filePath)
    await poolRunWait({
      pool : filePool,
      count: 1,
      func : async () => {
        if (!await fs.promises.stat(dir).catch(() => null)) {
          await fs.promises.mkdir(dir, {recursive: true})
        }
        await fs.promises.writeFile(filePath, data)
      },
    })
  },

  async getStat(filePath: string): Promise<FileStat> {
    const stat = await fs.promises.stat(filePath)
    return {
      size        : stat.size,
      dateCreated : Math.min(stat.birthtimeMs, stat.mtimeMs),
      dateModified: stat.mtimeMs,
    }
  },

  async deletePath(_path: string): Promise<boolean> {
    if (!this.existPath(_path)) {
      return false
    }
    await fs.promises.rm(_path, {recursive: true, force: true})
    return true
  },
}

export class FileControllerMock implements IFileController {
  private readonly _files = new Map<string, {
    data: Buffer
    stat: FileStat
  }>()

  constructor() {

  }

  existPath(_path: string): Promise<boolean> {
    return Promise.resolve(this._files.has(_path))
  }

  readFile(filePath: string): Promise<Buffer> {
    if (!this._files.has(filePath)) {
      return Promise.reject(new Error('File is not exist: ' + filePath))
    }
    return Promise.resolve(this._files.get(filePath)?.data)
  }

  writeFile(filePath: string, data: Buffer) {
    const file = this._files.get(filePath)
    const now = Date.now()
    this._files.set(filePath, {
      data,
      stat: {
        size        : data.length,
        dateCreated : file?.stat.dateCreated ?? now,
        dateModified: now,
      },
    })
    return Promise.resolve()
  }

  getStat(filePath: string): Promise<FileStat> {
    if (!this._files.has(filePath)) {
      return Promise.reject(new Error('File is not exist: ' + filePath))
    }
    return Promise.resolve(this._files.get(filePath)?.stat)
  }

  deletePath(_path: string): Promise<boolean> {
    if (!this.existPath(_path)) {
      return Promise.resolve(false)
    }
    this._files.delete(_path)
    return Promise.resolve(true)
  }
}
