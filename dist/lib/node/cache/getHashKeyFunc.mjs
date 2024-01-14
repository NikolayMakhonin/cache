import crypto from 'crypto';
import { getJsonKeyFunc } from '../../common/cache/getJsonKeyFunc.mjs';
import '../../common/cache/normalizeObject.mjs';

function getHashKeyFunc(args = {}) {
    const getJsonKey = getJsonKeyFunc(args);
    const algorithm = args.algorithm || 'sha256';
    return function getHashKey(obj) {
        const json = getJsonKey(obj);
        return crypto.createHash(algorithm).update(json).digest('base64url');
    };
}

export { getHashKeyFunc };
