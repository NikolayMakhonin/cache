import path from 'path'
import {
  BufferConverter, deleteEmptyDirs,
  fileControllerDefault,
  IFileController, readDirRecursive,
  StringConverter,
} from 'src/node'
import crypto from 'crypto'

export interface IAsyncMap<K, V> {
  set(key: K, value: V): Promise<void>
  get(key: K): Promise<V | undefined>
  delete(key: K): Promise<void>
  /** Check the key if exists */
  hasKey(key: K): Promise<boolean>
  /** Check the key and value if exists, and value is not corrupted */
  hasValue(key: K): Promise<boolean>
  keys(): Promise<K[]>
  clear(): Promise<void>
}

export type FileMapOptions = {
  useHash?: boolean
  deleteIfHashIncorrect?: boolean
}

export type FileMapArgs<Key, Value> = {
  dir: string
  keyPathConverter: StringConverter<Key>
  valueBufferConverter: BufferConverter<Value>
  fileController?: IFileController
  options?: FileMapOptions
}

async function checkHash({
  fileController,
  buffer: _buffer,
  hashBuffer: _hashBuffer,
  filePath,
  hashFilePath,
  deleteIfHashIncorrect,
}: {
  fileController: IFileController,
  buffer?: Buffer,
  hashBuffer?: Buffer,
  filePath: string,
  hashFilePath: string,
  deleteIfHashIncorrect?: boolean,
}): Promise<boolean> {
  const [buffer, hashBuffer] = await Promise.all([
    _buffer || fileController.readFile(filePath),
    _hashBuffer || fileController.readFile(hashFilePath),
  ])

  const hashExpected = hashBuffer.toString('utf-8')
  const hashActual = crypto.createHash('sha256').update(buffer).digest('base64url')
  if (hashExpected !== hashActual) {
    if (deleteIfHashIncorrect) {
      await Promise.all([
        fileController.deletePath(hashFilePath),
        fileController.deletePath(filePath),
      ])
      console.warn(`Incorrect hash. Files deleted:\r\n${filePath}\r\n${hashFilePath}`)
    }
    else {
      console.warn(`Incorrect hash:\r\n${filePath}\r\n${hashFilePath}`)
    }
    return false
  }
  return true
}

export class FileMap<Key, Value> implements IAsyncMap<Key, Value> {
  private readonly _dir: string
  private readonly _keyPathConverter: StringConverter<Key>
  private readonly _valueBufferConverter: BufferConverter<Value>
  private readonly _fileController: IFileController
  private readonly _options: FileMapOptions

  constructor({
    dir,
    keyPathConverter,
    valueBufferConverter,
    fileController,
    options,
  }: FileMapArgs<Key, Value>) {
    this._dir = dir
    this._keyPathConverter = keyPathConverter
    this._valueBufferConverter = valueBufferConverter
    this._fileController = fileController || fileControllerDefault
    this._options = options || {}
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

    let hashFilePath: string
    let hashBuffer: Buffer
    if (this._options.useHash) {
      hashFilePath = filePath + '.hash'
      const hash = crypto.createHash('sha256').update(buffer).digest('base64url')
      hashBuffer = Buffer.from(hash, 'utf-8')
    }

    await Promise.all([
      hashFilePath && this._fileController.writeFile(hashFilePath, hashBuffer),
      this._fileController.writeFile(filePath, buffer),
    ])
  }

  async get(key: Key): Promise<Value | undefined> {
    const filePath = this._getFilePath(key)
    const hashFilePath = this._options.useHash
      ? filePath + '.hash'
      : null

    const exist = await Promise.all([
      hashFilePath && this._fileController.existPath(hashFilePath),
      this._fileController.existPath(filePath),
    ])
    if (hashFilePath && !exist[0] || !exist[1]) {
      return void 0
    }

    const [hashBuffer, buffer] = await Promise.all([
      hashFilePath && this._fileController.readFile(hashFilePath, {dontThrowIfNotExist: true}),
      this._fileController.readFile(filePath, {dontThrowIfNotExist: true}),
    ])

    if (hashFilePath && hashBuffer == null || buffer == null) {
      return void 0
    }

    if (hashFilePath && !await checkHash({
      fileController       : this._fileController,
      buffer,
      hashBuffer,
      filePath,
      hashFilePath,
      deleteIfHashIncorrect: this._options.deleteIfHashIncorrect,
    })) {
      return void 0
    }

    const value = await this._valueBufferConverter.bufferToValue(buffer)

    return value
  }

  async delete(key: Key): Promise<void> {
    const filePath = this._getFilePath(key)
    const hashFilePath = filePath + '.hash'
    await Promise.all([
      this._fileController.deletePath(hashFilePath),
      this._fileController.deletePath(filePath),
    ])
    await deleteEmptyDirs(this._fileController, this._dir, filePath)
  }

  private async _has(key: Key, _checkHash: boolean): Promise<boolean> {
    const filePath = this._getFilePath(key)
    const hashFilePath = this._options.useHash
      ? filePath + '.hash'
      : null

    const exist = await Promise.all([
      hashFilePath && this._fileController.existPath(hashFilePath),
      this._fileController.existPath(filePath),
    ])

    if (hashFilePath && !exist[0] || !exist[1]) {
      return false
    }

    if (_checkHash && hashFilePath && !await checkHash({
      fileController       : this._fileController,
      filePath,
      hashFilePath,
      deleteIfHashIncorrect: this._options.deleteIfHashIncorrect,
    })) {
      return false
    }

    return true
  }

  async hasKey(key: Key): Promise<boolean> {
    return this._has(key, false)
  }

  async hasValue(key: Key): Promise<boolean> {
    return this._has(key, true)
  }

  async keys(): Promise<Key[]> {
    const pathWithStats = await readDirRecursive(this._fileController, this._dir)
    const keys = []
    for (let i = 0, len = pathWithStats.length; i < len; i++) {
      const pathWithStat = pathWithStats[i]
      if (
        pathWithStat.stat.isDirectory
        || pathWithStat.path.endsWith('.hash')
      ) {
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
