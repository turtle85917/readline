import FunnyTerminal from "funny-terminal";

const readline = new FunnyTerminal();
readline.setPrompt("Input>");
readline.addInputListener((data) => {
  if (data === "quit") process.exit();
  console.log(`Recived : ${data}`);
})
  .addCloseListener(() => console.log("Quit."));
