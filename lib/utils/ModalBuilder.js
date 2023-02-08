"use strict";
/*
* File: ModalBuilder.ts
*
* Copyright (c) 2022-2022 turtle85917
*
* Licensed under MIT License. Please see more defails in LICENSE file.
*/
Object.defineProperty(exports, "__esModule", { value: true });
exports.ModalBuilder = void 0;
const enums_1 = require("../enums");
const Frame_1 = require("./Frame");
class ModalBuilder {
    message;
    close;
    writeRow;
    rowLine;
    texture;
    get result() {
        this.render();
        return this.texture.join('\n');
    }
    constructor(message) {
        this.writeRow = 0;
        this.close = false;
        this.message = message;
        this.rowLine = '─'.repeat(process.stdout.columns - 2);
        this.texture = [this.frameTree(this.rowLine, [
                { key: enums_1.Tree.TOP_OPEN, kind: "open" },
                { key: enums_1.Tree.TOP_CLOSE, kind: "close" }
            ])];
    }
    frameTree(message, trees) {
        let result = message;
        for (const tree of trees) {
            if (tree.kind === "open")
                result = tree.key + result;
            else
                result += tree.key;
        }
        return result;
    }
    writeText(message) {
        if (this.close)
            return null;
        const content = message ?? this.message.slice(this.writeRow);
        const writeMessage = this.getTextLength(content) >= process.stdout.columns - 2
            ? content.slice(0, (this.getTextLength(content) - process.stdout.columns + 2) * -1)
            : content + ' '.repeat(process.stdout.columns - this.getTextLength(content) - 2);
        this.texture.push(this.frameTree(writeMessage, [
            { key: enums_1.Tree.MIDDLE_CELL, kind: "open" },
            { key: enums_1.Tree.MIDDLE_CELL, kind: "close" }
        ]));
        return writeMessage;
    }
    closeModal(shaders) {
        if (this.close)
            return false;
        this.close = true;
        this.texture.unshift('     ' + Object.entries(shaders).map(([k, v]) => this.firstWordUnderscore((0, Frame_1.putStyle)(k, ...v))).join('     '));
        this.texture.push(this.frameTree(this.rowLine, [
            { key: enums_1.Tree.BOTTOM_OPEN, kind: "open" },
            { key: enums_1.Tree.BOTTOM_CLOSE, kind: "close" }
        ]));
        return true;
    }
    render() {
        const result = this.writeText();
        this.writeRow = result?.length ?? 0;
        while (this.writeRow <= this.message.length)
            this.writeRow += this.writeText()?.length ?? 0;
        this.closeModal({
            "Quit": [enums_1.TextStyle.F_RED]
        });
    }
    getTextLength(message) {
        let length = 0;
        for (let i = 0; i < message.length; i++) {
            if (encodeURI(message.charAt(i)).length === 9)
                length++;
            length++;
        }
        return length;
    }
    firstWordUnderscore(message) {
        const clear = (0, Frame_1.clearStyle)(message);
        const content = clear ? clear.message : message;
        const styles = clear?.styles ?? [];
        styles.push(enums_1.TextStyle.UNDERSCORE);
        return (0, Frame_1.putStyle)(content[0].toUpperCase(), ...styles) + (0, Frame_1.putStyle)(content.slice(1).toLowerCase(), ...styles.slice(0, -1));
    }
}
exports.ModalBuilder = ModalBuilder;
//# sourceMappingURL=ModalBuilder.js.map