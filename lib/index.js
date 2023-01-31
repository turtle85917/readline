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
    listener;
    processing;
    /**
     * 초기화
     */
    constructor() {
        this.rline = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });
        this.autoFoucs = false;
        this.processing = false;
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
            this.rline.emit("action", action || key.name);
        });
    }
    /**
     * 사용자와의 상호작용을 사용하기 위함.
     *
     * @param prompt 배열
     */
    async processPrompts(promptObjects, callback) {
        this.rline.close();
        this.processing = true;
        this.clearScreen();
        const json = promptObjects.map(prompt => prompt.toJSON());
        const response = await prompts(json);
        callback(response, json);
        if (this.listener !== undefined) {
            this.rline = readline.createInterface({
                input: process.stdin,
                output: process.stdout
            });
            process.stdout.write('\n');
            this.processing = false;
            this.addInputListener(this.listener);
        }
        return response;
    }
    /**
     * 입력이 완료되었을 때 리스너 호출.
     *
     * @param listener 입력이 완료되어 Enter 키를 눌렀을 때 호출
     */
    addInputListener(listener) {
        this.setPrompt();
        this.listener = listener;
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
     * 프로세스가 죽었을 때 리스너 호출. `Ctrl + C` / `Ctrl + D`(*지원 안되는 경우, 무시됨*)을 눌렀을 때 프로세스 종료.
     *
     * @param listener 프로세스가 죽었을 때 호출.
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
     * 사용자의 입력이 완료되었을 때 자동 스크롤을 내릴지 여부 값을 지정.
     *
     * @param value 자동 스크롤 여부 값
     */
    setAutoFocus(value) {
        this.autoFoucs = value;
    }
    /**
     * 사용자의 입력을 기다릴 때 출력될 prompt를 지정.
     *
     * @param value prompt 값
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
     * 터미널의 스크롤을 터미널의 최근 출력된 값에 맞춰 조정.
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