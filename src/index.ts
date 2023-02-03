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

  /**
   * Initialization.
   */
  constructor() {
    this.rline = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
    this.autoFoucs = true;
    this.processing = false;
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
      this.processing = false;
      if (this.listeners.input !== undefined) this.addInputListener(this.listeners.input);
      if (this.listeners.action !== undefined) this.addActionListener(this.listeners.action);
    }

    return response;
  }

  private eventInitial() {
    if (this.processing) return true;
    this.clearScreen();
    if (this.prompt) this.rline.prompt();
    this.rline.emit("ready");
    return false;
  }

  private eventProcessing(name: ListenerName, data: string | ActionData) {
    this.clearScreen(this.autoFoucs);
    this.listeners[name](data);
    if (!this.processing && this.prompt) this.rline.prompt();
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
    const req = this.eventInitial();
    this.listeners.input = listener;
    if (req) return this;

    this.rline.on("line", (data) => this.eventProcessing("input", String(data).trim()));
    return this;
  }

  /**
   * Call the listener when a key on keyboard is pressed.
   * 
   * @param listener Listener to invoke.
   */
  addActionListener(listener: (data: ActionData) => void) {
    const req = this.eventInitial();
    this.listeners.action = listener;
    if (req) return this;

    this.rline.addListener("action", (data) => this.eventProcessing("action", data));
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
  setPrompt(value: string) {
    this.rline.setPrompt(value + (value.endsWith(' ') ? '' : ' '));
    this.prompt = this.rline.getPrompt();
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
