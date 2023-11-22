import {FileMap} from 'src/node/cache/FileMap'
import {createBufferConverterJson} from 'src/node'
import fs from 'fs'
import path from 'path'

async function checkPathExist(_path: string, exist: boolean) {
  const stat = await fs.promises.stat(_path).catch(() => null)
  if (exist && !stat) {
    throw new Error(`Path is not exist: ${_path}`)
  }
  if (!exist && stat) {
    throw new Error(`Path is exist: ${_path}`)
  }
}

describe('FileMap', function () {
  it('base', async function () {
    type Value = {
      a: number
      b: string
    }

    const dir = 'tmp/test/FileMap'

    await fs.promises.rm(dir, {recursive: true, force: true}).catch(() => null)

    const fileMap = new FileMap<string[], Value>({
      dir,
      keyPathConverter: {
        valueToString(value) {
          return value.join('/')
        },
        stringToValue(str) {
          return str.split('/')
        },
      },
      valueBufferConverter: createBufferConverterJson<Value>(),
    })

    // pre check:
    await checkPathExist(dir, false)
    expect(await fileMap.keys()).toEqual([])
    expect(await fileMap.has(['key1', 'key2'])).toEqual(false)
    expect(await fileMap.get(['key1', 'key2'])).toEqual(void 0)

    // set:
    await fileMap.set(['key1', 'key2'], {
      a: 1,
      b: '2',
    })
    await checkPathExist(path.join(dir, 'key1/key2'), true)
    expect(await fileMap.keys()).toEqual([['key1', 'key2']])
    expect(await fileMap.has(['key1', 'key2'])).toEqual(true)
    expect(await fileMap.get(['key1', 'key2'])).toEqual({
      a: 1,
      b: '2',
    })

    // update:
    await fileMap.set(['key1', 'key2'], {
      a: 3,
      b: '4',
    })
    await checkPathExist(path.join(dir, 'key1/key2'), true)
    expect(await fileMap.keys()).toEqual([['key1', 'key2']])
    expect(await fileMap.has(['key1', 'key2'])).toEqual(true)
    expect(await fileMap.get(['key1', 'key2'])).toEqual({
      a: 3,
      b: '4',
    })

    // add another:
    await fileMap.set(['key3', 'key4'], {
      a: 5,
      b: '6',
    })
    await checkPathExist(path.join(dir, 'key1/key2'), true)
    await checkPathExist(path.join(dir, 'key3/key4'), true)
    expect(await fileMap.keys()).toEqual([
      ['key1', 'key2'],
      ['key3', 'key4'],
    ])
    expect(await fileMap.has(['key1', 'key2'])).toEqual(true)
    expect(await fileMap.has(['key3', 'key4'])).toEqual(true)
    expect(await fileMap.get(['key1', 'key2'])).toEqual({
      a: 3,
      b: '4',
    })
    expect(await fileMap.get(['key3', 'key4'])).toEqual({
      a: 5,
      b: '6',
    })

    // delete:
    await fileMap.delete(['key1', 'key2'])
    await checkPathExist(path.join(dir, 'key1/key2'), false)
    await checkPathExist(path.join(dir, 'key1'), false)
    await checkPathExist(path.join(dir, 'key3/key4'), true)
    expect(await fileMap.keys()).toEqual([
      ['key3', 'key4'],
    ])
    expect(await fileMap.has(['key1', 'key2'])).toEqual(false)
    expect(await fileMap.has(['key3', 'key4'])).toEqual(true)
    expect(await fileMap.get(['key1', 'key2'])).toEqual(void 0)
    expect(await fileMap.get(['key3', 'key4'])).toEqual({
      a: 5,
      b: '6',
    })

    // clear:
    await fileMap.clear()
    await checkPathExist(dir, false)

    expect(await fileMap.keys()).toEqual([])
    expect(await fileMap.has(['key1', 'key2'])).toEqual(false)
    expect(await fileMap.has(['key3', 'key4'])).toEqual(false)
    expect(await fileMap.get(['key1', 'key2'])).toEqual(void 0)
    expect(await fileMap.get(['key3', 'key4'])).toEqual(void 0)

    // delete not exist:
    await fileMap.delete(['key1', 'key2'])
    await fileMap.delete(['key3', 'key4'])

    // clear not exist:
    await fileMap.clear()
  })
})
