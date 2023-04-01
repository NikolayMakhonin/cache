import type {BufferConverter} from './contracts'

type BufferEncoding = 'ascii' | 'utf8' | 'utf-8' | 'utf16le' | 'ucs2' | 'ucs-2' | 'base64' | 'base64url' | 'latin1' | 'binary' | 'hex'

export function createBufferConverterString({
  encoding = 'utf-8',
}: {
  encoding?: BufferEncoding
} = {}): BufferConverter<string> {
  return {
    bufferToValue(buffer) {
      return buffer.toString(encoding)
    },
    valueToBuffer(value) {
      return Buffer.from(value, encoding)
    },
  }
}

export function createBufferConverterJson<T>({
  pretty,
}: {
  pretty?: boolean
} = {}): BufferConverter<T> {
  return {
    bufferToValue(buffer) {
      return JSON.parse(buffer.toString('utf-8'))
    },
    valueToBuffer(value) {
      const str = pretty
        ? JSON.stringify(value, null, 2)
        : JSON.stringify(value)

      return Buffer.from(str, 'utf-8')
    },
  }
}
