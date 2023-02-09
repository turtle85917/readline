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
const __1 = require("..");
const enums_1 = require("../enums");
const Frame_1 = require("./Frame");
class ModalBuilder {
    message;
    close;
    writeRow;
    texture;
    components;
    readline;
    get result() {
        this.render();
        this.readline?.clearScreen();
        return this.texture.join('\n');
    }
    constructor(message, components) {
        this.writeRow = 0;
        this.close = false;
        this.message = message;
        this.components = components ?? [];
        this.texture = [this.frameTree(this.responsiveRepeat(), [
                { key: components === undefined ? enums_1.Tree.TOP_OPEN : enums_1.Tree.MIDDLE_RIGHT, kind: "open" },
                { key: enums_1.Tree.TOP_CLOSE, kind: "close" }
            ])];
        if (Array.isArray(components)) {
            this.readline = new __1.default();
            this.readline.setAutoFocus(false);
            this.readline.setCursorShow(false);
            this.readline.setAnyKeyPressed(true);
            this.readline.setKeypressDisable(true);
            this.readline.addActionListener((data) => {
                const component = components.find(item => item.key.name === data.key.name);
                if (component !== undefined)
                    component.key.action();
            });
        }
    }
    /**
     * Covers the newly printed message over the previously printed message.
     *
     * @param message Value.
     */
    coverMessage(message) {
        this.readline?.coverMessage(message);
    }
    setMessage(message) {
        this.message = message;
        this.writeRow = 0;
        this.close = false;
        this.texture = [this.frameTree(this.responsiveRepeat(), [
                { key: this.components.length > 0 ? enums_1.Tree.MIDDLE_RIGHT : enums_1.Tree.TOP_OPEN, kind: "open" },
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
            : content + this.responsiveRepeat(this.getTextLength(content), ' ');
        this.texture.push(this.frameTree(writeMessage, [
            { key: enums_1.Tree.MIDDLE_ROW, kind: "open" },
            { key: enums_1.Tree.MIDDLE_ROW, kind: "close" }
        ]));
        return writeMessage;
    }
    closeModal(shaders) {
        if (this.close)
            return false;
        this.close = true;
        this.texture.unshift(this.frameTree(shaders.map(item => ` ${this.firstWordUnderscore((0, Frame_1.putStyle)(item.name, ...item.shaders))} `).join('   '), [
            { key: enums_1.Tree.MIDDLE_LEFT, kind: "open" },
            { key: enums_1.Tree.TOP_OPEN, kind: "open" }
        ]));
        this.texture.push(this.frameTree(this.responsiveRepeat(), [
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
        this.closeModal(this.components);
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
    responsiveRepeat(length = 0, repeatContent = enums_1.Tree.MIDDLE_COLUMN) {
        return repeatContent.repeat(process.stdout.columns - length - 2);
    }
}
exports.ModalBuilder = ModalBuilder;
//# sourceMappingURL=ModalBuilder.js.map