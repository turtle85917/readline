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
        this.texture = [this.frameTree(this.rowLine, "TOP_OPEN", "TOP_CLOSE")];
    }
    frameTree(message, ...trees) {
        let result = '';
        for (const tree of trees) {
            if (tree.endsWith("OPEN"))
                result = enums_1.Tree[tree] + message;
            else if (tree.endsWith("CELL")) {
                if (result.startsWith(enums_1.Tree.MIDDLE_CELL))
                    result += enums_1.Tree[tree];
                else
                    result = enums_1.Tree[tree] + message;
            }
            else
                result += enums_1.Tree[tree];
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
        this.texture.push(this.frameTree(writeMessage, "MIDDLE_CELL", "MIDDLE_CELL"));
        return writeMessage;
    }
    closeModal() {
        if (this.close)
            return false;
        this.close = true;
        this.texture.push(this.frameTree(this.rowLine, "BOTTOM_OPEN", "BOTTOM_CLOSE"));
        return true;
    }
    render() {
        const result = this.writeText();
        this.writeRow = result?.length ?? 0;
        while (this.writeRow <= this.message.length)
            this.writeRow += this.writeText()?.length ?? 0;
        this.closeModal();
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
}
exports.ModalBuilder = ModalBuilder;
//# sourceMappingURL=ModalBuilder.js.map