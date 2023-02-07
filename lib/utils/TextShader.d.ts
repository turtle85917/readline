import { TextStyle } from "../enums";
export declare class TextShader {
    private message;
    private lastIndex;
    private shaders;
    private rules;
    private resultMessages;
    get result(): string;
    /**
     * Initialization.
     *
     * @param message
     */
    constructor(message: string);
    /**
     * Style the text.
     *
     * @param shaders The text to be replaced and the style list object.
     */
    applyShaders(shaders: Shaders): this;
    /**
     * Use regular expressions to fine-tune the style.
     *
     * @param rules A rule and style list array.
     */
    applyRules(rules: Rule[]): this;
    private render;
    private newResultMessage;
    private split;
}
type Shaders = Record<string, TextStyle[]>;
interface Rule {
    rule: RegExp;
    shaders: TextStyle[];
}
export {};
