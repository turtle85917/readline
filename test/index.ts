import Readline from "../src";

const readline = new Readline();
readline.setAutoFocus(false);
readline.addInputEvent((data) => {
  process.stdout.write(`Recived : ${String(data)}`);
});
