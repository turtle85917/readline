"use strict";
/*
* File: Frame.ts
*
* Copyright (c) 2022-2022 turtle85917
*
* Licensed under MIT License. Please see more defails in LICENSE file.
*/
Object.defineProperty(exports, "__esModule", { value: true });
exports.clearStyle = exports.putStyle = exports.REGEXP_ANSI = void 0;
exports.REGEXP_ANSI = /(\x1b\[([\d;]+)m)(.+|)(\x1b\[0m)/;
/**
 * Enclose it in ascii code.
 *
 * @param value Value.
 * @param styles Ansi codes. It is convenient to use TextStyle.
 */
const putStyle = (value, ...styles) => {
    return `\x1b[${styles.join(';')}m${value}\x1b[0m`;
};
exports.putStyle = putStyle;
/**
 * Clear ascii code.
 *
 * @param value Value.
 */
const clearStyle = (value) => {
    if (!exports.REGEXP_ANSI.test(value))
        return null;
    const exec = exports.REGEXP_ANSI.exec(value);
    return {
        styles: exec[2].split(';').map(Number),
        message: exec[3]
    };
};
exports.clearStyle = clearStyle;
//# sourceMappingURL=Frame.js.map