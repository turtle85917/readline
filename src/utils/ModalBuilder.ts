/*
* File: ModalBuilder.ts
* 
* Copyright (c) 2022-2022 turtle85917
* 
* Licensed under MIT License. Please see more defails in LICENSE file.
*/

import Readline from "..";
import { TextStyle, Tree } from "../enums";
import { putStyle, clearStyle } from "./Frame";

export class ModalBuilder {
  private message: string;
  private close: boolean;
  private writeRow: number;
  private texture: string[];
  private components: Component[];
  private readline?: Readline;

  public get result() {
    this.render();
    this.readline?.clearScreen();
    return this.texture.join('\n');
  }

  constructor(message: string, components?: Component[]) {
    this.writeRow = 0;
    this.close = false;
    this.message = message;
    this.components = components ?? [];
    this.texture = [this.frameTree(this.responsiveRepeat(), [
      { key: components === undefined ? Tree.TOP_OPEN : Tree.MIDDLE_RIGHT, kind: "open" },
      { key: Tree.TOP_CLOSE, kind: "close" }
    ])];

    if (Array.isArray(components)) {
      this.readline = new Readline();
      this.readline.setAutoFocus(false);
      this.readline.setCursorShow(false);
      this.readline.setAnyKeyPressed(true);
      this.readline.setKeypressDisable(true);
      this.readline.addActionListener((data) => {
        const component = components.find(item => item.key.name === data.key.name);
        if (component !== undefined) component.key.action();
      });
    }
  }

  /**
   * Covers the newly printed message over the previously printed message.
   * 
   * @param message Value.
   */
  coverMessage(message: string) {
    this.readline?.coverMessage(message);
  }

  setMessage(message: string) {
    this.message = message;
    this.writeRow = 0;
    this.close = false;
    this.texture = [this.frameTree(this.responsiveRepeat(), [
      { key: this.components.length > 0 ? Tree.MIDDLE_RIGHT : Tree.TOP_OPEN, kind: "open" },
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
      : content + this.responsiveRepeat(this.getTextLength(content), ' ')
    ;

    this.texture.push(this.frameTree(writeMessage, [
      { key: Tree.MIDDLE_ROW, kind: "open" },
      { key: Tree.MIDDLE_ROW, kind: "close" }
    ]));
    return writeMessage;
  }

  private closeModal(shaders: Component[]) {
    if (this.close) return false;
    this.close = true;
    this.texture.unshift(this.frameTree(shaders.map(item => ` ${this.firstWordUnderscore(putStyle(item.name, ...item.shaders))} `).join('   '), [
      { key: Tree.MIDDLE_LEFT, kind: "open" },
      { key: Tree.TOP_OPEN, kind: "open" }
    ]));
    this.texture.push(this.frameTree(this.responsiveRepeat(), [
      { key: Tree.BOTTOM_OPEN, kind: "open" },
      { key: Tree.BOTTOM_CLOSE, kind: "close" }
    ]));
    return true;
  }

  private render() {
    const result = this.writeText();
    this.writeRow = result?.length ?? 0;
    while (this.writeRow <= this.message.length) this.writeRow += this.writeText()?.length ?? 0;

    this.closeModal(this.components);
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

  private responsiveRepeat(length: number = 0, repeatContent: string = Tree.MIDDLE_COLUMN) {
    return repeatContent.repeat(process.stdout.columns - length - 2);
  }
}

interface Component {
  name: string;
  shaders: TextStyle[];
  key: Key;
}

interface Key {
  name: string;
  action: () => void;
}
