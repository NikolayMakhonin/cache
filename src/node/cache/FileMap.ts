import path from 'path'
import {
  BufferConverter, deleteEmptyDirs,
  fileControllerDefault,
  IFileController, readDirRecursive,
  StringConverter,
} from 'src/node'

export interface IAsyncMap<K, V> {
  set(key: K, value: V): Promise<void>
  get(key: K): Promise<V | undefined>
  delete(key: K): Promise<void>
  has(key: K): Promise<boolean>
  keys(): Promise<K[]>
  clear(): Promise<void>
}

export type FileMapArgs<Key, Value> = {
  dir: string
  keyPathConverter: StringConverter<Key>
  valueBufferConverter: BufferConverter<Value>
  fileController?: IFileController
}

export class FileMap<Key, Value> implements IAsyncMap<Key, Value> {
  private readonly _dir: string
  private readonly _keyPathConverter: StringConverter<Key>
  private readonly _valueBufferConverter: BufferConverter<Value>
  private readonly _fileController: IFileController

  constructor({
    dir,
    keyPathConverter,
    valueBufferConverter,
    fileController,
  }: FileMapArgs<Key, Value>) {
    this._dir = dir
    this._keyPathConverter = keyPathConverter
    this._valueBufferConverter = valueBufferConverter
    this._fileController = fileController || fileControllerDefault
  }

  private _getFilePath(key: Key): string {
    const relativePath = this._keyPathConverter.valueToString(key)

    // protect from save data everywhere except in specified dir
    if (/(?:^|[\\/])[.]+(?:[\\/]|$)/.test(relativePath)) {
      throw new Error(`Disallowed '..' or '.' in path: ${relativePath}`)
    }

    const filePath = path.join(this._dir, relativePath)

    return filePath
  }

  async set(key: Key, value: Value): Promise<void> {
    const filePath = this._getFilePath(key)
    const buffer = await this._valueBufferConverter.valueToBuffer(value)
    await this._fileController.writeFile(filePath, buffer)
  }

  async get(key: Key): Promise<Value | undefined> {
    const filePath = this._getFilePath(key)
    if (!(await this._fileController.existPath(filePath))) {
      return void 0
    }
    const buffer = await this._fileController.readFile(filePath, {dontThrowIfNotExist: true})
    if (buffer == null) {
      return void 0
    }
    const value = await this._valueBufferConverter.bufferToValue(buffer)
    return value
  }

  async delete(key: Key): Promise<void> {
    const filePath = this._getFilePath(key)
    await this._fileController.deletePath(filePath)
    await deleteEmptyDirs(this._fileController, this._dir, filePath)
  }

  async has(key: Key): Promise<boolean> {
    const filePath = this._getFilePath(key)
    return this._fileController.existPath(filePath)
  }

  async keys(): Promise<Key[]> {
    const pathWithStats = await readDirRecursive(this._fileController, this._dir)
    const keys = []
    for (let i = 0, len = pathWithStats.length; i < len; i++) {
      const pathWithStat = pathWithStats[i]
      if (pathWithStat.stat.isDirectory) {
        continue
      }
      const key = this._keyPathConverter.stringToValue(pathWithStat.path)
      if (key != null) {
        keys.push(key)
      }
    }
    return keys
  }

  async clear(): Promise<void> {
    await this._fileController.deletePath(this._dir)
  }
}
