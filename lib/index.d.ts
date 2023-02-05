/// <reference types="node" />
import * as prompts from "prompts";
import * as readline from "node:readline";
import { PromptBuilder } from "./utils";
export * from "./utils";
export default class Readline {
    prompt?: string;
    rline: readline.Interface;
    private listeners;
    private coverMessageLength;
    private autoFoucs;
    private processing;
    private keypressDisable;
    private onlyDirectionKeys;
    private ASDWIsDirectionKeys;
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
     * Prevents receiving input even when it can receive input.
     *
     * @param value Value.
     */
    setKeypressDisable(value: boolean): void;
    /**
     * Specifies that only the arrow keys are input unconditionally.
     *
     * @param value Value.
     */
    setOnlyDirectionKeys(value: boolean): void;
    /**
     * It determines whether the A, S, D, W keys are used as direction keys.
     *
     * @param value Value.
     */
    setASDWIsDirectionKeys(value: boolean): void;
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
     * Determines whether the cursor is visible.
     *
     * @param value Value. Default value is `true`.
     */
    setCursorShow(value?: boolean): void;
    private clearScreen;
    private newReadline;
    private eventInitial;
    private eventProcessing;
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
