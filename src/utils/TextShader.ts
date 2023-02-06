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
  private shaders: Shaders;
  private resultMessages: string[];
  private lastIndex: number;

  public get result() {
    return this.resultMessages.join('');
  }

  constructor(message: string) {
    this.message = message;
    this.shaders = {};
    this.resultMessages = [];
    this.lastIndex = 0;
  }

  applyShaders(shaders: Shaders) {
    this.shaders = shaders;
    this.resultMessages = [];
    this.message.replace(new RegExp(Object.keys(this.shaders).join('|'), 'g'), (substring: string, index: number) => {
      if (this.resultMessages.length === 0) {
        this.lastIndex = substring.length + index;
        const [f, m, e] = this.split(this.message, index, this.lastIndex);
        this.resultMessages.push(f, Frame(m, ...this.shaders[substring]), e);
      } else {
        const lastIndex = substring.length+index;
        const [f, m, e] = this.split(this.resultMessages.at(-1), index-this.lastIndex, lastIndex-this.lastIndex);
        this.lastIndex = lastIndex;
        this.resultMessages.pop();
        this.resultMessages.push(f, Frame(m, ...this.shaders[substring]), e);
      }
      return substring;
    });

    return this;
  }

  private split(content: string, ...indices: number[]) {
    return [0, ...indices].map((item, index, array) => content.slice(item, array[index+1]));
  }
}

type Shaders = Record<string, NonNullable<ShaderValue>>;

type ShaderValue = TextStyle[] | undefined;
