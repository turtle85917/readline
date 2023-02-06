"use strict";
/*
* File: TextShader.ts
*
* Copyright (c) 2022-2022 turtle85917
*
* Licensed under MIT License. Please see more defails in LICENSE file.
*/
Object.defineProperty(exports, "__esModule", { value: true });
exports.TextShader = void 0;
const Frame_1 = require("./Frame");
class TextShader {
    message;
    shaders;
    char;
    position;
    nextPosition;
    resultMessages;
    get result() {
        return this.resultMessages.join('');
    }
    constructor(message) {
        this.message = message;
        this.shaders = {};
        this.char = null;
        this.position = 0;
        this.nextPosition = 0;
        this.resultMessages = [];
        this.readChar();
    }
    applyShaders(shaders) {
        this.shaders = {};
        for (const [k, v] of Object.entries(shaders)) {
            if (k.length > 1) {
                this.shaders[k[0]] = { shaders: v, tail: k.slice(1) };
            }
            else
                this.shaders[k] = { shaders: v };
        }
        while (this.nextPosition <= this.message.length)
            this.nextToken();
        return this;
    }
    readChar() {
        this.char = this.nextPosition >= this.message.length ? null : this.message[this.nextPosition];
        this.position = this.nextPosition;
        this.nextPosition++;
    }
    nextToken() {
        if (this.char !== null) {
            const currentShader = this.shaders[this.char];
            if (currentShader !== undefined) {
                if (currentShader.tail) {
                    const complete = `${this.char}${currentShader.tail}`;
                    const position = this.position;
                    this.readChar();
                    while (currentShader.tail.includes(this.char))
                        this.readChar();
                    const messagePart = this.message.slice(position, this.position);
                    if (complete === messagePart)
                        this.resultMessages.push((0, Frame_1.Frame)(messagePart, ...currentShader.shaders), this.char);
                    else
                        this.resultMessages.push(messagePart, this.char);
                }
                else {
                    this.resultMessages.push((0, Frame_1.Frame)(this.char, ...currentShader.shaders));
                }
            }
            else {
                this.resultMessages.push(this.char);
            }
        }
        this.readChar();
    }
}
exports.TextShader = TextShader;
//# sourceMappingURL=TextShader.js.map