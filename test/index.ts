import Readline from "../src";

const readline = new Readline();
readline.setAutoFocus(true);
readline.addInputListener((data) => {
  readline.write(`Recived : ${data}`);
  if (data === "quit") process.exit();
});
readline.addCloseListener(() => console.log("\nEnd readline."))
