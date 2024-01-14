import crypto from 'crypto'
import {getJsonKeyFunc} from '../../common/cache/getJsonKeyFunc'
import {NormalizeObjectArgs} from 'src/common'

export function getHashKeyFunc(args: {
  algorithm?: string
} & NormalizeObjectArgs = {}) {
  const getJsonKey = getJsonKeyFunc(args)
  const algorithm = args.algorithm || 'sha256'
  return function getHashKey(obj?: any): string {
    const json = getJsonKey(obj)
    return crypto.createHash(algorithm).update(json).digest('base64url')
  }
}
