function normalizeObject<T>(obj: T, {
  sortKeys = true,
  deep = true,
}: {
  sortKeys?: boolean
  deep?: boolean
} = {}): T {
  if (!obj || typeof obj !== 'object') {
    return obj
  }

  const keys = Object.keys(obj)

  if (sortKeys) {
    keys.sort()
  }

  return keys.reduce((a, key) => {
    const value: any = obj[key]
    if (value != null && value !== '') {
      a[key] = value
    }
    return a
  }, {} as T)
}

export function getJsonKeyFunc(params: {} = {}) {
  return function getJsonKey<T>(obj: T) {
    obj = normalizeObject(obj)
    return JSON.stringify(obj ?? null)
  }
}
