const DELETE = Symbol('DELETE');
const EMPTY_ARRAY = Object.freeze([]);
function normalizeObject(obj, args = {}) {
    const result = _normalizeObject(obj, args);
    if (result === DELETE) {
        return void 0;
    }
    return result;
}
function _normalizeObject(obj, args = {}, _path) {
    const { custom } = args;
    if (custom) {
        obj = custom(_path || EMPTY_ARRAY, obj);
    }
    if (obj === DELETE) {
        return obj;
    }
    if (obj == null || typeof obj !== 'object') {
        return obj;
    }
    if (Array.isArray(obj)) {
        const result = [];
        for (let i = 0, len = obj.length; i < len; i++) {
            let value = obj[i];
            const __path = _path ? [..._path, i + ''] : [i + ''];
            value = _normalizeObject(value, args, __path);
            if (value === DELETE) {
                continue;
            }
            result.push(value);
        }
        return result;
    }
    if (obj.constructor === Object) {
        const { dontDeleteNullKeys } = args;
        const result = {};
        const keys = Object.keys(obj);
        keys.sort();
        for (let i = 0, len = keys.length; i < len; i++) {
            const key = keys[i];
            let value = obj[key];
            const __path = _path ? [..._path, key] : [key];
            value = _normalizeObject(value, args, __path);
            if (!dontDeleteNullKeys && value == null) {
                continue;
            }
            if (value === DELETE) {
                continue;
            }
            result[key] = value;
        }
        return result;
    }
    throw new Error(`Unknown object type\npath: [${(_path || EMPTY_ARRAY).join('][')}]\nconstructor: ${obj.constructor.name}\nuse the 'custom' option to convert or filter it`);
}

export { DELETE, normalizeObject };
