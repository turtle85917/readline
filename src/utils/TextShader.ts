/*
* File: TextShader.ts
* 
* Copyright (c) 2022-2022 turtle85917
* 
* Licensed under MIT License. Please see more defails in LICENSE file.
*/

import { TextStyle } from "../enums";
import { Frame } from "./Frame";

export class TextShader {
  private message: string;
  private lastIndex: number;
  private shaders: Shaders;
  private rules: Rule[];
  private resultMessages: string[];

  public get result() {
    this.render();
    return this.resultMessages.join('');
  }

  /**
   * Initialization.
   * 
   * @param message 
   */
  constructor(message: string) {
    this.message = message;
    this.lastIndex = 0;
    this.shaders = {};
    this.rules = [];
    this.resultMessages = [];
  }

  /**
   * Style the text.
   * 
   * @param shaders The text to be replaced and the style list object.
   */
  applyShaders(shaders: Shaders) {
    this.shaders = shaders;
    return this;
  }

  /**
   * Use regular expressions to fine-tune the style.
   * 
   * @param rules A rule and style list array.
   */
  applyRules(rules: Rule[]) {
    this.rules = rules;
    return this;
  }

  private render() {
    this.resultMessages = [];
    [...this.message.matchAll(new RegExp([...Object.keys(this.shaders), ...this.rules].map(item => {
      if (typeof item === "object") return item.rule.toString().slice(1, -1);
      return item;
    }).join('|'), 'g'))].forEach(match => {
      const findShader = this.shaders[match[0]];
      if (findShader === undefined) {
        const findRule = this.rules.find(item => item.rule.test(match[0]));
        this.newResultMessage(match[0], match.index, findRule.shaders);
      } else {
        this.newResultMessage(match[0], match.index, findShader);
      }
    });
  }

  private newResultMessage(substring: string, index: number, shaders: TextStyle[]) {
    if (this.resultMessages.length === 0) {
      this.lastIndex = substring.length + index;
      const [f, m, e] = this.split(this.message, index, this.lastIndex);
      this.resultMessages.push(f, Frame(m, ...shaders), e);
    } else {
      const lastIndex = substring.length+index;
      const [f, m, e] = this.split(this.resultMessages.at(-1), index-this.lastIndex, lastIndex-this.lastIndex);
      this.lastIndex = lastIndex;
      this.resultMessages.pop();
      this.resultMessages.push(f, Frame(m, ...shaders), e);
    }
  }

  private split(content: string, ...indices: number[]) {
    return [0, ...indices].map((item, index, array) => content.slice(item, array[index+1]));
  }
}

type Shaders = Record<string, TextStyle[]>;

interface Rule {
  rule: RegExp;
  shaders: TextStyle[];
}
