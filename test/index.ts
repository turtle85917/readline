import Readline from "../src";

const readline = new Readline();
readline.setPrompt("Input");
readline.setAutoFocus(true);
readline.addInputListener((data) => {
  readline.write(`Recived : ${data}\n`);
  if (data === "quit") process.exit();
});
readline.addCloseListener(() => console.log("\nEnd readline."));
