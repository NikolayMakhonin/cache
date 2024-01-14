'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function getStackTrace() {
    let stack = new Error().stack;
    if (stack != null) {
        const index = stack.indexOf('\n');
        if (index != null && index >= 0) {
            stack = stack.substring(index + 1);
        }
    }
    return stack !== null && stack !== void 0 ? stack : '';
}

exports.getStackTrace = getStackTrace;
