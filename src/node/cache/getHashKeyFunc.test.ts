import {getHashKeyFunc} from './getHashKeyFunc'

describe('getHashKeyFunc', function () {
  it('base', function () {
    const getHashKey = getHashKeyFunc()
    const num = Math.random()
    const hash = getHashKey({a: {b: num}})
    console.log('hash: ' + hash)
    assert.strictEqual(typeof hash, 'string')
    assert.ok(hash.length > 10)
    assert.strictEqual(getHashKey({a: {b: num}}), hash)
  })
})
