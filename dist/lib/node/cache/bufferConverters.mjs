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
            return JSON.parse(buffer.toString('utf-8'));
        },
        valueToBuffer(value) {
            const str = pretty
                ? JSON.stringify(value, null, 2)
                : JSON.stringify(value);
            return Buffer.from(str, 'utf-8');
        },
    };
}

export { createBufferConverterJson, createBufferConverterString };
