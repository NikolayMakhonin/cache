function normalizeObject(obj, args = {}, _path) {
    if (obj == null || typeof obj !== 'object') {
        return obj;
    }
    if (Array.isArray(obj)) {
        const { filter } = args;
        const result = [];
        for (let i = 0, len = obj.length; i < len; i++) {
            let value = obj[i];
            if (filter) {
                const __path = _path ? [..._path, i + ''] : [i + ''];
                if (!filter(__path, value)) {
                    continue;
                }
            }
            value = normalizeObject(value, args, _path);
            result.push(value);
        }
        return result;
    }
    if (obj.constructor === Object) {
        const { filter } = args;
        const result = {};
        const keys = Object.keys(obj);
        keys.sort();
        for (let i = 0, len = keys.length; i < len; i++) {
            const key = keys[i];
            let value = obj[key];
            if (filter) {
                const __path = _path ? [..._path, key] : [key];
                if (!filter(__path, value)) {
                    continue;
                }
            }
            value = normalizeObject(value, args, _path);
            result[key] = value;
        }
        return result;
    }
    if (args.convertUnknown) {
        return args.convertUnknown(obj);
    }
    throw new Error(`Unknown object type: ${obj}, use convertUnknown to convert it`);
}

export { normalizeObject };
