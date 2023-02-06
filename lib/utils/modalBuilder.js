"use strict";
/*
* File: modalBuilder.ts
*
* Copyright (c) 2022-2022 turtle85917
*
* Licensed under MIT License. Please see more defails in LICENSE file.
*/
Object.defineProperty(exports, "__esModule", { value: true });
exports.ModalBuilder = void 0;
class ModalBuilder {
    rowLine;
    constructor(message) {
        this.rowLine = '─'.repeat(process.stdout.columns - 2);
        console.log(`┌${this.rowLine}┐`);
        console.log(`│${' '.repeat(process.stdout.columns - 2)}│`);
        console.log(`│${' '.repeat(process.stdout.columns - 2)}│`);
        console.log(`│${' '.repeat(process.stdout.columns - 2)}│`);
        console.log(`└${this.rowLine}┘`);
    }
}
exports.ModalBuilder = ModalBuilder;
//# sourceMappingURL=modalBuilder.js.map