'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function createBufferConverterString({ encoding = 'utf-8', } = {}) {
    return {
        bufferToValue(buffer) {
            return buffer.toString(encoding);
        },
        valueToBuffer(value) {
            return Buffer.from(value, encoding);
        },
    };
}
function createBufferConverterJson({ pretty, } = {}) {
    return {
        bufferToValue(buffer) {
            const str = buffer.toString('utf-8');
            try {
                return JSON.parse(str);
            }
            catch (err) {
                console.error('Error parse JSON:\n' + str.substring(0, 50000));
                throw err;
            }
        },
        valueToBuffer(value) {
            const str = pretty
                ? JSON.stringify(value, null, 2)
                : JSON.stringify(value);
            return Buffer.from(str, 'utf-8');
        },
    };
}

exports.createBufferConverterJson = createBufferConverterJson;
exports.createBufferConverterString = createBufferConverterString;
