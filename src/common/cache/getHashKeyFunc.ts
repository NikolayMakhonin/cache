import crypto from 'crypto'
import {getJsonKeyFunc} from './getJsonKeyFunc'

export function getHashKeyFunc(algorithm: string = 'sha256') {
  const getJsonKey = getJsonKeyFunc()
  return function getHashKey(obj?: any): string {
    const json = getJsonKey(obj)
    return crypto.createHash(algorithm).update(json).digest('base64url')
  }
}
