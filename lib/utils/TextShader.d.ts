import { TextStyle } from "../enums";
export declare class TextShader {
    private message;
    private shaders;
    private char;
    private position;
    private nextPosition;
    private resultMessages;
    get result(): string;
    constructor(message: string);
    applyShaders(shaders: Shaders): this;
    private readChar;
    private nextToken;
}
type Shaders = Record<string, NonNullable<ShaderValue>>;
type ShaderValue = TextStyle[] | undefined;
export {};
