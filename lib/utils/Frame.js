"use strict";
/*
* File: Frame.ts
*
* Copyright (c) 2022-2022 turtle85917
*
* Licensed under MIT License. Please see more defails in LICENSE file.
*/
Object.defineProperty(exports, "__esModule", { value: true });
exports.Frame = void 0;
/**
 * Enclose it in ascii code.
 *
 * @param value Value.
 * @param styles Ansi codes. It is convenient to use TextStyle.
 */
const Frame = (value, ...styles) => {
    return `\x1b[${styles.join(';')}m${value}\x1b[0m`;
};
exports.Frame = Frame;
//# sourceMappingURL=Frame.js.map