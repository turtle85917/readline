import * as rl from "node:readline";
import Readline from "../lib";

const readline = new Readline();
readline.setPrompt("Input");
readline.setAutoFocus(true);
readline.processPrompts(
  { type: "select", name: "bananaLike", message: "바나나를 좋아하십니까?", choices: [{title: "네", value: "yes"}, {title: "아뇨", value: "no"}] },
  { type: prev => prev === "yes" ? "select" : null, name: "appleLike", message: "사과를 좋아하십니까?", choices: [{title: "네", value: "yes"}, {title: "아뇨", value: "no"}] }
).then(res => {
  let result = "당신은 ";
  if (res.bananaLike === "yes" && res.appleLike === "yes") result += "바나나와 사과를 좋아합니다. :)";
  else if (res.bananaLike === "no" && res.appleLike === "no") result += "바나나와 사과를 싫어합니다. :)";
  else result += "바나나 혹은 사과 중 한개를 싫어합니다. :)";

  readline.write(result);
});
// readline.addInputListener((data) => {
//   readline.write(`Recived : ${data}\n`);
//   if (data === "quit") process.exit();
// });
// readline.addCloseListener(() => console.log("\nEnd readline."));
