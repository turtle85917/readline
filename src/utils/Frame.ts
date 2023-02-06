/*
* File: Frame.ts
* 
* Copyright (c) 2022-2022 turtle85917
* 
* Licensed under MIT License. Please see more defails in LICENSE file.
*/

import { TextStyle } from "../enums";

/**
 * Enclose it in ascii code.
 * 
 * @param value Value.
 * @param styles Ansi codes. It is convenient to use TextStyle.
 */
export const Frame = (value: string, ...styles: TextStyle[]) => {
  return `\x1b[${styles.join(';')}m${value}\x1b[0m`;
}
