/*
* File: ModalBuilder.ts
* 
* Copyright (c) 2022-2022 turtle85917
* 
* Licensed under MIT License. Please see more defails in LICENSE file.
*/

import { Tree } from "../enums";

export class ModalBuilder {
  private close: boolean;
  private writeRow: number;
  private rowLine: string;
  private texture: string[];

  constructor(message: string) {
    this.rowLine = '─'.repeat(process.stdout.columns-2);
    this.writeRow = 1;
    this.close = false;
    this.texture = [this.frameTree(this.rowLine, "TOP_OPEN", "TOP_CLOSE")];

    this.texture.push(this.frameTree(
      this.getTextLength(message) >= process.stdout.columns-2
        ? message.slice(0, (this.getTextLength(message) - process.stdout.columns + 2) * -1)
        : message
      , "MIDDLE_CELL", "MIDDLE_CELL"));

    this.writeRow = this.getTextLength(message) - process.stdout.columns + 2;
    // TODO new line
    this.closeModal();
    process.stdout.write(this.texture.join('\n'));
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

  private writeTexture(newLine: boolean = true) {
  }

  private closeModal() {
    if (this.close) return false;
    this.close = true;
    this.texture.push(this.frameTree(this.rowLine, "BOTTOM_OPEN", "BOTTOM_CLOSE"));
    return true;
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
