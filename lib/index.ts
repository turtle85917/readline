import * as prompts from "prompts";
import * as readline from "node:readline";

export default class Readline {
  public rline: readline.Interface;
  private autoFoucs: boolean;
  private prompt?: string;

  /**
   * 초기화
   */
  constructor() {
    this.rline = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
    this.autoFoucs = false;
  }

  /**
   * 사용자와의 상호작용을 사용하기 위함.
   * 
   * @param prompt 배열
   */
  async processPrompts(...prompt: prompts.PromptObject[]) {
    this.clearScreen();
    const response = await prompts(prompt);
    return response;
  }

  /**
   * 입력이 완료되었을 때 리스너 호출. prompt 값이 지정되었을 경우 입력을 기다릴 때, `>`를 뒤에 붙인 후 출력을 하고 입력을 기다림.
   * 
   * @param listener 입력이 완료되어 Enter 키를 눌렀을 때 호출
   */
  addInputListener(listener: (...args: string[]) => void) {
    this.clearScreen();
    this.printPrompt();
    this.rline.on("line", (data) => {
      if (this.autoFoucs) this.clearScreen();
      listener(String(data).trim());
      this.printPrompt();
    });

    return this;
  }

  /**
   * 프로세스가 죽었을 때 리스너 호출. `Ctrl + C` / `Ctrl + D`(*지원 안되는 경우, 무시됨*)을 눌렀을 때 프로세스 종료.
   * 
   * @param listener 프로세스가 죽었을 때 호출.
   */
  addCloseListener(listener: (code: number) => void) {
    process.on("SIGINT", process.exit); // Ctrl + C
    process.on("SIGQUIT", process.exit); // Ctrl + D
    process.on("SIGBREAK", process.exit);
    process.stdin.on("end", process.exit);
    process.on("exit", (code) => {
      listener(code);
      this.rline.close();
    });
  }

  /**
   * 사용자의 입력이 완료되었을 때 자동 스크롤을 내릴지 여부 값을 지정.
   * 
   * @param value 자동 스크롤 여부 값
   */
  setAutoFocus(value: boolean) {
    this.autoFoucs = value;
  }

  /**
   * 사용자의 입력을 기다릴 때 출력될 prompt를 지정. *`>`는 자동으로 붙여줌.*
   * 
   * @param value prompt 값
   */
  setPrompt(value: string) {
    this.prompt = value;
  }

  private printPrompt() {
    if (this.prompt !== undefined) this.write(`${this.prompt}> `);
  }

  /**
   * 터미널의 스크롤을 터미널의 최근 출력된 값에 맞춰 조정.
   */
  clearScreen() {
    console.log('\n'.repeat(Math.max(process.stdout.rows-2, 0)));
    readline.cursorTo(process.stdout, 0, 0);
    readline.clearScreenDown(process.stdout);
  }

  /**
   * `console.log`를 대신할 메소드.
   */
  write(content: string = '\n') {
    process.stdout.write(content);
  }
}
