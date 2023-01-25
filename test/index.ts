import Readline from "../lib";

const readline = new Readline();
readline.setPrompt("Input> ");
readline.setAutoFocus(true);
readline.addInputListener((data) => {
  readline.write(`Recived : ${data}\n`);
  if (data === "quit") process.exit();
  if (data === "question") question(readline);
});
readline.addCloseListener(() => console.log("\nEnd readline."));

const question = (readline: Readline) => {
  readline.processPrompts(
    [
      { type: "select", name: "banana", message: "Do you like banana?", choices: [{title: "Yes!", value: "yes"}, {title: "No", value: "no"}] },
      { type: prev => prev === "yes" ? "select" : null, name: "apple", message: "Do you like apple?", choices: [{title: "Yes!", value: "yes"}, {title: "No", value: "no"}] }
    ],
    (res) => {
      let result = '';
      if (res.banana === "yes" && res.apple === "yes") result = "You like bananas and apples. :)";
      else if (res.banana === "no" && res.apple === "no") result = "You hate bananas and apples. :)";
      else if (res.apple === "no") result = "You hate apples. :)";
      else result = "You hate bananas. :)";
    
      readline.write(result);
    }
  );
}
