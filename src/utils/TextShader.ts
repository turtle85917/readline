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
  private shaders: Record<string, ShaderDetailed>;
  private char: string | null;
  private position: number;
  private nextPosition: number;
  private resultMessages: string[];

  public get result() {
    return this.resultMessages.join('');
  }

  constructor(message: string) {
    this.message = message;
    this.shaders = {};
    this.char = null;
    this.position = 0;
    this.nextPosition = 0;
    this.resultMessages = [];

    this.readChar();
  }

  applyShaders(shaders: Shaders) {
    this.shaders = {};
    for (const [k, v] of Object.entries(shaders)) {
      if (k.length > 1) {
        this.shaders[k[0]] = { shaders: v, tail: k.slice(1) };
      } else this.shaders[k] = { shaders: v };
    }
    while (this.nextPosition <= this.message.length) this.nextToken();
    return this;
  }

  private readChar() {
    this.char = this.nextPosition >= this.message.length ? null : this.message[this.nextPosition];
    this.position = this.nextPosition;
    this.nextPosition++;
  }

  private nextToken() {
    if (this.char !== null) {
      const currentShader = this.shaders[this.char];
      if (currentShader !== undefined) {
        if (currentShader.tail) {
          const complete = `${this.char}${currentShader.tail}`;
          const position = this.position;
          this.readChar();
          while (currentShader.tail.includes(this.char)) this.readChar();

          const messagePart = this.message.slice(position, this.position);
          if (complete === messagePart) this.resultMessages.push(Frame(messagePart, ...currentShader.shaders), this.char);
          else this.resultMessages.push(messagePart, this.char);
        } else {
          this.resultMessages.push(Frame(this.char, ...currentShader.shaders));
        }
      } else {
        this.resultMessages.push(this.char);
      }
    }
    this.readChar();
  }
}

type Shaders = Record<string, NonNullable<ShaderValue>>;

type ShaderValue = TextStyle[] | undefined;

interface ShaderDetailed {
  shaders: TextStyle[];
  tail?: string;
}
