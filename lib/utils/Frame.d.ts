import { TextStyle } from "../enums";
export declare const REGEXP_ANSI: RegExp;
/**
 * Enclose it in ascii code.
 *
 * @param value Value.
 * @param styles Ansi codes. It is convenient to use TextStyle.
 */
export declare const putStyle: (value: string, ...styles: TextStyle[]) => string;
/**
 * Clear ascii code.
 *
 * @param value Value.
 */
export declare const clearStyle: (value: string) => {
    styles: TextStyle[];
    message: string;
} | null;
