/*
* File: ModalBuilder.ts
* 
* Copyright (c) 2022-2022 turtle85917
* 
* Licensed under MIT License. Please see more defails in LICENSE file.
*/

import { Tree } from "../enums";

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
    this.texture = [this.frameTree(this.rowLine, "TOP_OPEN", "TOP_CLOSE")];
  }

  private frameTree(message: string, ...trees: (keyof typeof Tree)[]) {
    let result = '';
    for (const tree of trees) {
      if (tree.endsWith("OPEN")) result = Tree[tree] + message;
      else if (tree.endsWith("CELL")) {
        if (result.startsWith(Tree.MIDDLE_CELL)) result += Tree[tree];
        else result = Tree[tree] + message;
      }
      else result += Tree[tree];
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

    this.texture.push(this.frameTree(writeMessage, "MIDDLE_CELL", "MIDDLE_CELL"));
    return writeMessage;
  }

  private closeModal() {
    if (this.close) return false;
    this.close = true;
    this.texture.push(this.frameTree(this.rowLine, "BOTTOM_OPEN", "BOTTOM_CLOSE"));
    return true;
  }

  private render() {
    const result = this.writeText();
    this.writeRow = result?.length ?? 0;
    while (this.writeRow <= this.message.length) this.writeRow += this.writeText()?.length ?? 0;

    this.closeModal();
  }

  private getTextLength(message: string) {
    let length = 0;
    for (let i = 0; i < message.length; i++) {
      if (encodeURI(message.charAt(i)).length === 9) length++;
      length++;
    }

    return length;
  }
}
