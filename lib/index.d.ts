/// <reference types="node" />
import * as prompts from "prompts";
import * as readline from "node:readline";
import PromptBuilder from "./promptBuilder";
export default class Readline {
    prompt?: string;
    rline: readline.Interface;
    private autoFoucs;
    private listeners;
    private processing;
    private coverMessageLength;
    /**
     * Initialization.
     */
    constructor();
    /**
     * To enable interaction with users.
     *
     * @param prompt prompt array.
     */
    processPrompts<T extends string, U extends Record<T, any>>(promptObjects: PromptBuilder<T>[], callback: (response: U, objects: prompts.PromptObject<T>) => void | Promise<void>): Promise<U>;
    private eventInitial;
    private eventProcessing;
    /**
     * Call the listener when setup finished.
     *
     * @param listener Listener to invoke.
     */
    addReadyListener(listener: () => void): this;
    /**
     * Call the listener when input is complete.
     *
     * @param listener Listener to invoke.
     */
    addInputListener(listener: (data: string) => void): this;
    /**
     * Call the listener when a key on keyboard is pressed.
     *
     * @param listener Listener to invoke.
     */
    addActionListener(listener: (data: ActionData) => void): this;
    /**
     * Call the listener when the process exits.
     *
     * @param listener Listener to invoke.
     */
    addCloseListener(listener: (code: number) => void): void;
    /**
     * Specifies whether to automatically scroll down after user input is complete.
     *
     * @param value Value.
     */
    setAutoFocus(value: boolean): void;
    /**
     * Set prompt.
     *
     * @param value Value.
     */
    setPrompt(value: string): void;
    /**
     * Covers the newly printed message over the previously printed message.
     *
     * @param message Value.
     */
    coverMessage(message: string): void;
    /**
     * Move to cursor to new line and write.
     *
     * @param message Value.
     */
    newLineToWirte(message: string): void;
    /**
     * Adjusts the scrolling of the terminal to match the terminal's last output value.
     */
    private clearScreen;
}
interface ActionData {
    name: string;
    key: Key;
}
interface Key {
    sequence: string;
    name: string;
    ctrl: boolean;
    meta: boolean;
    shift: boolean;
    code: string;
}
export {};
