/*
* File: Frame.ts
* 
* Copyright (c) 2022-2022 turtle85917
* 
* Licensed under MIT License. Please see more defails in LICENSE file.
*/

export const REGEXP_ANSI = /(\x1b\[([\d;]+)m)(.+|)(\x1b\[0m)/;

/**
 * Enclose it in ascii code.
 * 
 * @param value Value.
 * @param styles Ansi codes. It is convenient to use TextStyle.
 */
export const putStyle = (value: string, ...styles: number[]) => {
  return `\x1b[${styles.join(';')}m${value}\x1b[0m`;
}

/**
 * Clear ascii code.
 * 
 * @param value Value.
 */
export const clearStyle = (value: string) => {
  if (!REGEXP_ANSI.test(value)) return null;

  const exec = REGEXP_ANSI.exec(value)!;
  return {
    styles: exec[2].split(';').map<number>(Number),
    message: exec[3]
  };
}
