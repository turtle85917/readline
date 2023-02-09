import { TextStyle } from "../enums";
export declare class ModalBuilder {
    private message;
    private close;
    private writeRow;
    private texture;
    private components;
    private readline?;
    get result(): string;
    constructor(message: string, components?: Component[]);
    /**
     * Covers the newly printed message over the previously printed message.
     *
     * @param message Value.
     */
    coverMessage(message: string): void;
    setMessage(message: string): void;
    private frameTree;
    private writeText;
    private closeModal;
    private render;
    private getTextLength;
    private firstWordUnderscore;
    private responsiveRepeat;
}
interface Component {
    name: string;
    shaders: TextStyle[];
    key: Key;
}
interface Key {
    name: string;
    action: () => void;
}
export {};
