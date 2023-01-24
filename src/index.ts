import * as readline from "node:readline";

export default class Readline {
  public stdin: NodeJS.Socket;
  private autoFoucs: boolean;

  constructor() {
    this.stdin = process.openStdin();
    this.autoFoucs = false;
    this.stdin.setEncoding("utf8");
  }

  addInputListener(listener: (...args: string[]) => void) {
    this.clearScreen();
    this.stdin.addListener("data", (data) => {
      if (this.autoFoucs) this.clearScreen();
      listener(String(data).trim());
    });

    return this;
  }

  addCloseListener(listener: (code: number) => void) {
    process.on("SIGINT", () => process.exit()); // Ctrl + C
    process.stdin.on("end", () => process.exit()); // Ctrl + D
    process.on("exit", listener);
    return this;
  }

  setAutoFocus(value: boolean) {
    this.autoFoucs = value;
  }

  clearScreen() {
    console.log('\n'.repeat(Math.max(process.stdout.rows-2, 0)));
    readline.cursorTo(process.stdout, 0, 0);
    readline.clearScreenDown(process.stdout);
  }

  write(content: string = '\n') {
    process.stdout.write(content);
  }
}
