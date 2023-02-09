export declare const REGEXP_ANSI: RegExp;
/**
 * Enclose it in ascii code.
 *
 * @param value Value.
 * @param styles Ansi codes. It is convenient to use TextStyle.
 */
export declare const putStyle: (value: string, ...styles: number[]) => string;
/**
 * Clear ascii code.
 *
 * @param value Value.
 */
export declare const clearStyle: (value: string) => {
    styles: number[];
    message: string;
} | null;
