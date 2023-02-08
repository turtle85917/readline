/*
* File: ModalBuilder.ts
* 
* Copyright (c) 2022-2022 turtle85917
* 
* Licensed under MIT License. Please see more defails in LICENSE file.
*/

import { TextStyle, Tree } from "../enums";
import { putStyle, clearStyle } from "./Frame";

export class ModalBuilder {
  private message: string;
  private close: boolean;
  private writeRow: number;
  private rowLine: string;
  private texture: string[];

  public get result() {
    this.render();
    return this.texture.join('\n');
  }
  

  constructor(message: string) {
    this.writeRow = 0;
    this.close = false;
    this.message = message;
    this.rowLine = '─'.repeat(process.stdout.columns-2);
    this.texture = [this.frameTree(this.rowLine, [
      { key: Tree.TOP_OPEN, kind: "open" },
      { key: Tree.TOP_CLOSE, kind: "close" }
    ])];
  }

  private frameTree(message: string, trees: { key: Tree, kind: "open" | "middle" | "close" }[]) {
    let result = message;
    for (const tree of trees) {
      if (tree.kind === "open") result = tree.key + result;
      else result += tree.key;
    }

    return result;
  }

  private writeText(message?: string) {
    if (this.close) return null;
    const content = message ?? this.message.slice(this.writeRow);
    const writeMessage = this.getTextLength(content) >= process.stdout.columns-2
      ? content.slice(0, (this.getTextLength(content) - process.stdout.columns + 2) * -1)
      : content + ' '.repeat(process.stdout.columns-this.getTextLength(content)-2)
    ;

    this.texture.push(this.frameTree(writeMessage, [
      { key: Tree.MIDDLE_CELL, kind: "open" },
      { key: Tree.MIDDLE_CELL, kind: "close" }
    ]));
    return writeMessage;
  }

  private closeModal(shaders: Record<string, TextStyle[]>) {
    if (this.close) return false;
    this.close = true;
    this.texture.unshift('     ' + Object.entries(shaders).map(([k, v]) => this.firstWordUnderscore(putStyle(k, ...v))).join('     '));
    this.texture.push(this.frameTree(this.rowLine, [
      { key: Tree.BOTTOM_OPEN, kind: "open" },
      { key: Tree.BOTTOM_CLOSE, kind: "close" }
    ]));
    return true;
  }

  private render() {
    const result = this.writeText();
    this.writeRow = result?.length ?? 0;
    while (this.writeRow <= this.message.length) this.writeRow += this.writeText()?.length ?? 0;

    this.closeModal({
      "Quit": [TextStyle.F_RED]
    });
  }

  private getTextLength(message: string) {
    let length = 0;
    for (let i = 0; i < message.length; i++) {
      if (encodeURI(message.charAt(i)).length === 9) length++;
      length++;
    }

    return length;
  }

  private firstWordUnderscore(message: string) {
    const clear = clearStyle(message);
    const content = clear ? clear.message : message;
    const styles = clear?.styles ?? [];
    styles.push(TextStyle.UNDERSCORE);

    return putStyle(content[0].toUpperCase(), ...styles) + putStyle(content.slice(1).toLowerCase(), ...styles.slice(0, -1));
  }
}
