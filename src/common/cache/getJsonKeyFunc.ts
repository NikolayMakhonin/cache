import {
  normalizeObject,
  NormalizeObjectArgs,
} from 'src/common/cache/normalizeObject'

export function getJsonKeyFunc(params: NormalizeObjectArgs = {}) {
  return function getJsonKey<T>(obj: T) {
    obj = normalizeObject(obj, params)
    return JSON.stringify(obj ?? null)
  }
}
