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
  private listeners: Record<ListenerName, (data: string|ActionData) => void|undefined>;
  private processing: boolean;
  private coverMessageLength: number;
  private keypressDisable: boolean;

  /**
   * Initialization.
   */
  constructor() {
    this.rline = readline.createInterface({
      input: process.stdin,
    });
    this.autoFoucs = true;
    this.processing = false;
    this.coverMessageLength = 0;
    this.keypressDisable = false;
    this.listeners = { input: undefined, action: undefined };

    readline.emitKeypressEvents(process.stdin, this.rline);
    if (process.stdin.isTTY) process.stdin.setRawMode(true);
    process.stdin.on("keypress", (_, key: Key) => {
      let action = '';

      if (key.ctrl) {
        if (key.name === 'c') process.exit();
        if (key.name === 'd') process.exit();
        if (key.name === 'z') action = "undo";
        if (key.name === 'y') action = "redo";
      }

      if (key.name === "return") action = "submit" // Enter
      if (key.name === "enter") action = "submit"; // Ctrl + J
      if (key.name === "abort") process.exit();
      if (["up", "down", "left", "right"].some(k => key.name === k)) action = key.name;

      if (action !== '') this.rline.emit("action", { name: action, key } as ActionData);
    });
    process.on("SIGINT", process.exit);
    process.on("SIGQUIT", process.exit);
    process.on("SIGBREAK", process.exit);
    process.stdin.on("end", process.exit);
  }

  /**
   * To enable interaction with users.
   * 
   * @param prompt prompt array.
   */
  async processPrompts<T extends string, U extends Record<T, any>>(promptObjects: PromptBuilder<T>[], callback: (response: U, objects: prompts.PromptObject<T>) => void|Promise<void>) {
    this.rline.close();
    this.processing = true;
    this.clearScreen();
    const json: prompts.PromptObject<T> = promptObjects.map(prompt => prompt.toJSON()) as any;
    const response: U = await prompts<T>(json) as any;

    callback(response, json);

    if (Object.values(this.listeners).some(item => item !== undefined)) {
      this.rline = readline.createInterface({
        input: process.stdin,
        output: process.stdout
      });
      this.setPrompt(this.prompt);
      process.stdout.write('\n');
      if (this.listeners.input !== undefined) {
        if (this.prompt !== undefined) this.rline.prompt();
        this.addInputListener(this.listeners.input);
      }
      if (this.listeners.action !== undefined) this.addActionListener(this.listeners.action);
      this.processing = false;
    }

    return response;
  }

  private eventInitial() {
    if (!this.processing) this.clearScreen();
    this.rline.emit("ready");
  }

  private eventProcessing(name: ListenerName, data: string | ActionData) {
    if (this.processing) return;
    this.clearScreen(this.autoFoucs);
    if (name === "input" && this.keypressDisable) return;
    this.listeners[name](data);
    if (this.prompt !== undefined && !this.processing) this.rline.prompt();
  }

  /**
   * Call the listener when setup finished.
   * 
   * @param listener Listener to invoke.
   */
  addReadyListener(listener: () => void) {
    this.rline.addListener("ready", listener);
    return this;
  }

  /**
   * Call the listener when input is complete.
   * 
   * @param listener Listener to invoke.
   */
  addInputListener(listener: (data: string) => void) {
    this.eventInitial();
    this.listeners.input = listener;

    this.rline.on("line", (data) => this.eventProcessing("input", String(data).trim()));
    return this;
  }

  /**
   * Call the listener when a key on keyboard is pressed.
   * 
   * @param listener Listener to invoke.
   */
  addActionListener(listener: (data: ActionData) => void) {
    this.eventInitial();
    this.listeners.action = listener;

    this.rline.addListener("action", (data) => this.eventProcessing("action", data));
    return this;
  }

  /**
   * Call the listener when the process exits.
   * 
   * @param listener Listener to invoke.
   */
  addCloseListener(listener: (code: number) => void) {
    process.on("exit", (code) => {
      listener(code);
      this.setCursorShow(true);
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
  setPrompt(value: string) {
    this.rline.setPrompt(value + (value.endsWith(' ') ? '' : ' '));
    this.prompt = this.rline.getPrompt();
  }

  /**
   * Prevents receiving input even when it can receive input.
   * 
   * @param value Value.
   */
  setKeypressDisable(value: boolean) {
    this.keypressDisable = value;
  }

  /**
   * Covers the newly printed message over the previously printed message.
   * 
   * @param message Value.
   */
  coverMessage(message: string) {
    process.stdout.write(message);
    this.coverMessageLength = (message.match(/\n/g) ?? []).length;
    readline.cursorTo(process.stdout, 0, -1);
  }

  /**
   * Move to cursor to new line and write.
   * 
   * @param message Value.
   */
  newLineToWirte(message: string) {
    readline.cursorTo(process.stdout, 0, this.coverMessageLength);
    process.stdout.write(message);
  }

  /**
   * Determines whether the cursor is visible.
   * 
   * @param value Value. Default value is `true`.
   */
  setCursorShow(value: boolean = true) {
    if (!process.stderr.isTTY) return;
    process.stderr.write(`\u001B[?25${value ? 'h' : 'l'}`);
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

type ListenerName = "input" | "action";

interface ActionData {
  name: string;
  key: Key;
}

interface Key {
  sequence: string;
  name: string;
  ctrl: boolean;
  meta: boolean;
  shift: boolean;
  code: string;
}
