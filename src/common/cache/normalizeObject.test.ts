import {DELETE, normalizeObject} from 'src/common'

describe('normalizeObject', function () {
  it('base', async function () {
    assert.deepStrictEqual(normalizeObject({
      d: void 0,
      b: [3, void 0, null, 1, 2],
      c: null,
      a: {
        b: 2,
        d: void 0,
        c: [{ b: 1 }, { a: 2 }, { c: 1 }, null, void 0],
        a: 1,
        e: null,
      },
    }), {
      a: {
        a: 1,
        b: 2,
        c: [
          { b: 1 },
          { a: 2 },
          { c: 1 },
          null,
          void 0,
        ],
      },
      b: [3, void 0, null, 1, 2],
    })
  })

  it('convertUnknown', async function () {
    const custom = (_path: string[], value: object) => {
      if (value.constructor === Set) {
        return Array.from(value)
      }
      if (value.constructor === RegExp) {
        return null
      }
      if (value.constructor === Map) {
        return DELETE
      }
      return value
    }

    assert.deepStrictEqual(normalizeObject({
      b: {
        c: /a/,
        a: new Set([2, new Map(), 3, 1]),
      },
      c: new Map(),
      a: new Set([3, 1, 2]),
    }, {
      custom,
    }), {
      a: [3, 1, 2],
      b: {
        a: [2, 3, 1],
      },
    })

    assert.deepStrictEqual(normalizeObject(new Set([3, 1, 2]), {
      custom,
    }), [3, 1, 2])

    assert.deepStrictEqual(normalizeObject(new Map(), {
      custom,
    }), void 0)

    // throws
    assert.throws(() => {
      normalizeObject(/a/)
    })
    assert.throws(() => {
      normalizeObject({ a: /a/ })
    })
    assert.throws(() => {
      normalizeObject([/a/])
    })
  })
})
