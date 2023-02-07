/*
* File: ModalBuilder.ts
* 
* Copyright (c) 2022-2022 turtle85917
* 
* Licensed under MIT License. Please see more defails in LICENSE file.
*/

export class ModalBuilder {
  private rowLine: string;

  constructor(message: string) {
    this.rowLine = '─'.repeat(process.stdout.columns-2);

    // console.log(`┌${this.rowLine}┐`);
    // console.log(`│${' '.repeat(process.stdout.columns-2)}│`);
    // console.log(`│${' '.repeat(process.stdout.columns-2)}│`);
    // console.log(`│${' '.repeat(process.stdout.columns-2)}│`);
    // console.log(`└${this.rowLine}┘`);
  }
}
