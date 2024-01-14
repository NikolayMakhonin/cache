export type NormalizeObjectArgs = {
  filter?: (_path: string[], value: any) => boolean
  convertUnknown?: (value: any) => any
  dontDeleteNullKeys?: boolean
}

export function normalizeObject<T>(
  obj: T,
  args: NormalizeObjectArgs = {},
  _path?: string[],
): T {
  if (obj == null || typeof obj !== 'object') {
    return obj
  }

  if (Array.isArray(obj)) {
    const {filter} = args
    const result: any[] = []
    for (let i = 0, len = obj.length; i < len; i++) {
      let value = obj[i]
      if (filter) {
        const __path = _path ? [..._path, i + ''] : [i + '']
        if (!filter(__path, value)) {
          continue
        }
      }
      value = normalizeObject(value, args, _path)
      result.push(value)
    }
    return result as any
  }

  if (obj.constructor === Object) {
    const {dontDeleteNullKeys, filter} = args
    const result: any = {}
    const keys = Object.keys(obj)
    keys.sort()
    for (let i = 0, len = keys.length; i < len; i++) {
      const key = keys[i]
      let value = obj[key]
      if (!dontDeleteNullKeys && value == null) {
        continue
      }
      if (filter) {
        const __path = _path ? [..._path, key] : [key]
        if (!filter(__path, value)) {
          continue
        }
      }
      value = normalizeObject(value, args, _path)
      result[key] = value
    }
    return result
  }

  if (args.convertUnknown) {
    return args.convertUnknown(obj)
  }

  throw new Error(`Unknown object type: ${obj}, use convertUnknown to convert it`)
}
