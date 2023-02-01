/*
* File: index.ts
* 
* Copyright (c) 2022-2022 turtle85917
* 
* Licensed under MIT License. Please see more defails in LICENSE file.
*/

import * as prompts from "prompts";
import * as readline from "node:readline";
import PromptBuilder from "./promptBuilder";

export default class Readline {
  public prompt?: string;
  public rline: readline.Interface;
  private autoFoucs: boolean;
  private listeners: Record<"input"|"action", (data: string) => void|undefined>;
  private processing: boolean;

  /**
   * Initialization.
   */
  constructor() {
    this.rline = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
    this.autoFoucs = false;
    this.processing = false;
    this.listeners = { input: undefined, action: undefined };

    readline.emitKeypressEvents(process.stdin, this.rline);
    if (process.stdin.isTTY) process.stdin.setRawMode(true);
    process.stdin.on("keypress", (_, key: Key) => {
      let action = '';

      if (key.ctrl) {
        if (key.name === 'c') process.exit();
        if (key.name === 'd') process.exit();
      }

      if (key.name === "return") action = "submit" // Enter
      if (key.name === "enter") action = "submit"; // Ctrl + J
      if (key.name === "abort") process.exit();
      if (["up", "down", "left", "right"].some(k => key.name === k)) action = key.name;

      this.rline.emit("action", action);
    });
  }

  /**
   * To enable interaction with users.
   * 
   * @param prompt prompt array.
   */
  async processPrompts<T extends string, U extends Record<T, any>>(promptObjects: PromptBuilder<T>[], callback: (response: U, objects: prompts.PromptObject<T>) => void) {
    this.rline.close();
    this.processing = true;
    this.clearScreen();
    const json: prompts.PromptObject<T> = promptObjects.map(prompt => prompt.toJSON()) as any;
    const response: U = await prompts<T>(json) as any;

    callback(response, json);

    if (this.listeners.input !== undefined) {
      this.rline = readline.createInterface({
        input: process.stdin,
        output: process.stdout
      });
      process.stdout.write('\n');
      this.processing = false;
      this.addInputListener(this.listeners.input);
      this.addActionListener(this.listeners.action);
    }

    return response;
  }

  /**
   * Call the listener when input is complete.
   * 
   * @param listener Listener to invoke.
   */
  addInputListener(listener: (data: string) => void) {
    this.setPrompt();
    this.listeners.input = listener;
    if (this.processing) return this;

    this.rline.prompt();
    this.rline.on("line", (data) => {
      this.clearScreen(this.autoFoucs);
      listener(String(data).trim());
      if (!this.processing) this.rline.prompt();
    });

    return this;
  }

  /**
   * Call the listener when a key on keyboard is pressed.
   * 
   * @param listener Listener to invoke.
   */
  addActionListener(listener: (data: string) => void) {
    this.listeners.action = listener;
    this.rline.addListener("action", listener);
    return this;
  }

  /**
   * Call the listener when the process exits.
   * 
   * @param listener Listener to invoke.
   */
  addCloseListener(listener: (code: number) => void) {
    process.on("SIGINT", process.exit);
    process.on("SIGQUIT", process.exit);
    process.on("SIGBREAK", process.exit);
    process.stdin.on("end", process.exit);
    process.on("exit", (code) => {
      listener(code);
      this.rline.close();
    });
  }

  /**
   * Specifies whether to automatically scroll down after user input is complete.
   * 
   * @param value Value.
   */
  setAutoFocus(value: boolean) {
    this.autoFoucs = value;
  }

  /**
   * Set prompt.
   * 
   * @param value Value.
   */
  setPrompt(value?: string) {
    if (value !== undefined) {
      this.clearScreen();
      this.prompt = `${value} `;
      this.rline.setPrompt(value);
    } else if (this.rline.getPrompt() !== this.prompt && this.prompt !== undefined) {
      this.rline.setPrompt(this.prompt);
    }
  }

  /**
   * Adjusts the scrolling of the terminal to match the terminal's last output value.
   */
  private clearScreen(value: boolean = true) {
    if (value !== undefined && !value) return;
    console.log('\n'.repeat(Math.max(process.stdout.rows-2, 0)));
    readline.cursorTo(process.stdout, 0, 0);
    readline.clearScreenDown(process.stdout);
  }
}

interface Key {
  sequence: string;
  name: string;
  ctrl: boolean;
  meta: boolean;
  shift: boolean;
  code: string;
}
