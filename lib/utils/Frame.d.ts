import { TextStyle } from "../enums";
/**
 * Enclose it in ascii code.
 *
 * @param value Value.
 * @param styles Ansi codes. It is convenient to use TextStyle.
 */
export declare const Frame: (value: string, ...styles: TextStyle[]) => string;
