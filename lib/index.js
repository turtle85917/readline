"use strict";
/*
* File: index.ts
*
* Copyright (c) 2022-2022 turtle85917
*
* Licensed under MIT License. Please see more defails in LICENSE file.
*/
Object.defineProperty(exports, "__esModule", { value: true });
const prompts = require("prompts");
const readline = require("node:readline");
class Readline {
    prompt;
    rline;
    autoFoucs;
    listeners;
    processing;
    /**
     * Initialization.
     */
    constructor() {
        this.rline = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });
        this.autoFoucs = false;
        this.processing = false;
        this.listeners = { input: undefined, action: undefined };
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
            }
            if (key.name === "return")
                action = "submit"; // Enter
            if (key.name === "enter")
                action = "submit"; // Ctrl + J
            if (key.name === "abort")
                process.exit();
            if (["up", "down", "left", "right"].some(k => key.name === k))
                action = key.name;
            this.rline.emit("action", action);
        });
    }
    /**
     * To enable interaction with users.
     *
     * @param prompt prompt array.
     */
    async processPrompts(promptObjects, callback) {
        this.rline.close();
        this.processing = true;
        this.clearScreen();
        const json = promptObjects.map(prompt => prompt.toJSON());
        const response = await prompts(json);
        callback(response, json);
        if (this.listeners.input !== undefined) {
            this.rline = readline.createInterface({
                input: process.stdin,
                output: process.stdout
            });
            process.stdout.write('\n');
            this.processing = false;
            this.addInputListener(this.listeners.input);
            this.addActionListener(this.listeners.action);
        }
        return response;
    }
    /**
     * Call the listener when input is complete.
     *
     * @param listener Listener to invoke.
     */
    addInputListener(listener) {
        this.setPrompt();
        this.listeners.input = listener;
        if (this.processing)
            return this;
        this.rline.prompt();
        this.rline.on("line", (data) => {
            this.clearScreen(this.autoFoucs);
            listener(String(data).trim());
            if (!this.processing)
                this.rline.prompt();
        });
        return this;
    }
    /**
     * Call the listener when a key on keyboard is pressed.
     *
     * @param listener Listener to invoke.
     */
    addActionListener(listener) {
        this.listeners.action = listener;
        this.rline.addListener("action", listener);
        return this;
    }
    /**
     * Call the listener when the process exits.
     *
     * @param listener Listener to invoke.
     */
    addCloseListener(listener) {
        process.on("SIGINT", process.exit);
        process.on("SIGQUIT", process.exit);
        process.on("SIGBREAK", process.exit);
        process.stdin.on("end", process.exit);
        process.on("exit", (code) => {
            listener(code);
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
        if (value !== undefined) {
            this.clearScreen();
            this.prompt = `${value} `;
            this.rline.setPrompt(value);
        }
        else if (this.rline.getPrompt() !== this.prompt && this.prompt !== undefined) {
            this.rline.setPrompt(this.prompt);
        }
    }
    /**
     * Adjusts the scrolling of the terminal to match the terminal's last output value.
     */
    clearScreen(value = true) {
        if (value !== undefined && !value)
            return;
        console.log('\n'.repeat(Math.max(process.stdout.rows - 2, 0)));
        readline.cursorTo(process.stdout, 0, 0);
        readline.clearScreenDown(process.stdout);
    }
}
exports.default = Readline;
//# sourceMappingURL=index.js.map