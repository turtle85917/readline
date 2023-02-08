"use strict";
/*
* File: index.ts
*
* Copyright (c) 2022-2022 turtle85917
*
* Licensed under MIT License. Please see more defails in LICENSE file.
*/
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
const prompts = require("prompts");
const readline = require("node:readline");
const DIRECTION_KEYS = ["up", "down", "left", "right"];
const ASDW_KEYS = { 'a': "left", 's': "down", 'd': "right", 'w': "up" };
__exportStar(require("./utils"), exports);
__exportStar(require("./enums"), exports);
class Readline {
    prompt;
    rline;
    listeners;
    coverMessageLength;
    autoFoucs;
    processing;
    keypressDisable;
    onlyDirectionKeys;
    ASDWIsDirectionKeys;
    /**
     * Initialization.
     */
    constructor() {
        this.rline = readline.createInterface({
            input: process.stdin
        });
        this.coverMessageLength = 0;
        this.listeners = { input: undefined, action: undefined };
        this.autoFoucs = true;
        this.processing = false;
        this.keypressDisable = false;
        this.onlyDirectionKeys = false;
        this.ASDWIsDirectionKeys = false;
        readline.emitKeypressEvents(process.stdin, this.rline);
        if (process.stdin.isTTY)
            process.stdin.setRawMode(true);
        process.stdin.on("keypress", (_, key) => {
            let action = '';
            if (key.ctrl) {
                if (key.name === 'c')
                    process.exit();
                if (key.name === 'd')
                    process.exit();
                if (key.name === 'z')
                    action = "undo";
                if (key.name === 'y')
                    action = "redo";
            }
            if (!this.onlyDirectionKeys) {
                if (key.name === "return")
                    action = "submit"; // Enter
                if (key.name === "enter")
                    action = "submit"; // Ctrl + J
            }
            if (key.name === "abort")
                process.exit();
            if (DIRECTION_KEYS.some(k => key.name === k) || (this.ASDWIsDirectionKeys && Object.keys(ASDW_KEYS).some(k => key.name === k)))
                action = ASDW_KEYS[key.name] ?? key.name;
            if (action !== '')
                this.rline.emit("action", { name: action, key });
        });
        process.on("SIGINT", process.exit);
        process.on("SIGQUIT", process.exit);
        process.on("SIGBREAK", process.exit);
        process.stdin.on("end", process.exit);
    }
    /**
     * To enable interaction with users.
     *
     * @param prompt prompt array.
     */
    async processPrompts(promptObjects, callback) {
        // BUG Normal behavior after prompt handling. Abnormal before that. 
        this.rline.close();
        this.processing = true;
        this.clearScreen();
        const json = promptObjects.map(prompt => prompt.toJSON());
        const response = await prompts(json);
        callback(response, json);
        if (Object.values(this.listeners).some(item => item !== undefined)) {
            this.newReadline();
            process.stdout.write('\n');
            if (this.listeners.input !== undefined) {
                if (this.prompt !== undefined)
                    this.rline.prompt();
                this.addInputListener(this.listeners.input);
            }
            if (this.listeners.action !== undefined)
                this.addActionListener(this.listeners.action);
            this.processing = false;
        }
        return response;
    }
    /**
     * Call the listener when setup finished.
     *
     * @param listener Listener to invoke.
     */
    addReadyListener(listener) {
        this.rline.addListener("ready", listener);
        return this;
    }
    /**
     * Call the listener when input is complete.
     *
     * @param listener Listener to invoke.
     */
    addInputListener(listener) {
        this.eventInitial();
        this.listeners.input = listener;
        this.rline.on("line", (data) => this.eventProcessing("input", String(data).trim()));
        return this;
    }
    /**
     * Call the listener when a key on keyboard is pressed.
     *
     * @param listener Listener to invoke.
     */
    addActionListener(listener) {
        this.eventInitial();
        this.listeners.action = listener;
        this.rline.addListener("action", (data) => this.eventProcessing("action", data));
        return this;
    }
    /**
     * Call the listener when the process exits.
     *
     * @param listener Listener to invoke.
     */
    addCloseListener(listener) {
        process.on("exit", (code) => {
            listener(code);
            this.setCursorShow(true);
            this.rline.close();
        });
    }
    /**
     * Specifies whether to automatically scroll down after user input is complete.
     *
     * @param value Value.
     */
    setAutoFocus(value) {
        this.autoFoucs = value;
    }
    /**
     * Set prompt.
     *
     * @param value Value.
     */
    setPrompt(value) {
        this.rline.setPrompt(value + (value.endsWith(' ') ? '' : ' '));
        this.prompt = this.rline.getPrompt();
    }
    /**
     * Prevents receiving input even when it can receive input.
     *
     * @param value Value.
     */
    setKeypressDisable(value) {
        this.keypressDisable = value;
        this.newReadline();
    }
    /**
     * Specifies that only the arrow keys are input unconditionally.
     *
     * @param value Value.
     */
    setOnlyDirectionKeys(value) {
        this.onlyDirectionKeys = value;
    }
    /**
     * It determines whether the A, S, D, W keys are used as direction keys.
     *
     * @param value Value.
     */
    setASDWIsDirectionKeys(value) {
        this.ASDWIsDirectionKeys = value;
    }
    /**
     * Covers the newly printed message over the previously printed message.
     *
     * @param message Value.
     */
    coverMessage(message) {
        process.stdout.write(message);
        this.coverMessageLength = (message.match(/\n/g) ?? []).length;
        readline.cursorTo(process.stdout, 0, -1);
    }
    /**
     * Move to cursor to new line and write.
     *
     * @param message Value.
     */
    newLineToWirte(message) {
        readline.cursorTo(process.stdout, 0, this.coverMessageLength);
        process.stdout.write(message);
    }
    /**
     * Determines whether the cursor is visible.
     *
     * @param value Value. Default value is `true`.
     */
    setCursorShow(value = true) {
        if (!process.stderr.isTTY)
            return;
        process.stderr.write(`\u001B[?25${value ? 'h' : 'l'}`);
    }
    clearScreen(value = true) {
        if (value !== undefined && !value)
            return;
        console.log('\n'.repeat(Math.max(process.stdout.rows - 2, 0)));
        readline.cursorTo(process.stdout, 0, 0);
        readline.clearScreenDown(process.stdout);
    }
    newReadline() {
        this.rline.close();
        this.rline = readline.createInterface({
            input: process.stdin,
            output: this.keypressDisable ? undefined : process.stdout
        });
        if (this.prompt !== undefined)
            this.setPrompt(this.prompt);
    }
    eventInitial() {
        if (!this.processing)
            this.clearScreen();
        this.rline.emit("ready");
    }
    eventProcessing(name, data) {
        if (this.processing)
            return;
        this.clearScreen(this.autoFoucs);
        if (name === "input" && this.keypressDisable)
            return;
        this.listeners[name]?.(data);
        if (this.prompt !== undefined && !this.processing)
            this.rline.prompt();
    }
}
exports.default = Readline;
//# sourceMappingURL=index.js.map