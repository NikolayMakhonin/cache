export const DELETE = Symbol('DELETE')

export type NormalizeObjectArgs = {
  /** return DELETE to delete value */
  custom?: (_path: readonly string[], value: any) => any
  dontDeleteNullKeys?: boolean
}

const EMPTY_ARRAY: readonly any[] = Object.freeze([])

export function normalizeObject<T>(
  obj: T,
  args: NormalizeObjectArgs = {},
): T {
  const result = _normalizeObject(obj, args)
  if ((result as any) === DELETE) {
    return void 0 as any
  }
  return result
}

function _normalizeObject<T>(
  obj: T,
  args: NormalizeObjectArgs = {},
  _path?: string[],
): T {
  const {custom} = args
  if (custom) {
    obj = custom(_path || EMPTY_ARRAY, obj)
  }

  if ((obj as any) === DELETE) {
    return obj
  }

  if (obj == null || typeof obj !== 'object') {
    return obj
  }

  if (Array.isArray(obj)) {
    const result: any[] = []
    for (let i = 0, len = obj.length; i < len; i++) {
      let value = obj[i]
      const __path = custom
        ? (_path ? [..._path, i + ''] : [i + ''])
        : _path
      value = _normalizeObject(value, args, __path)
      if (value === DELETE) {
        continue
      }
      result.push(value)
    }
    return result as any
  }

  if (obj.constructor === Object) {
    const {dontDeleteNullKeys} = args
    const result: any = {}
    const keys = Object.keys(obj)
    keys.sort()
    for (let i = 0, len = keys.length; i < len; i++) {
      const key = keys[i]
      let value = obj[key]
      const __path = custom
        ? (_path ? [..._path, key] : [key])
        : _path
      value = _normalizeObject(value, args, __path)
      if (!dontDeleteNullKeys && value == null) {
        continue
      }
      if (value === DELETE) {
        continue
      }
      result[key] = value
    }
    return result
  }

  throw new Error(`Unknown object type\npath: [${(_path || EMPTY_ARRAY).join('][')}]\nconstructor: ${obj.constructor.name}\nuse the 'custom' option to convert or filter it`)
}
