import Readline, { ModalBuilder, PromptBuilder, TextShader, TextStyle } from "../src";

// const readline = new Readline();
// readline.processPrompts<"openModal", { openModal: boolean; }>([
//   new PromptBuilder()
//     .setType("select")
//     .setName("openModal")
//     .setMessage("Would you like to open the modal?")
//     .setChoices([
//       { title: "Open modal", value: "open" },
//       { title: "No", value: "no" }
//     ])
// ], ({ openModal }) => {
//   if (openModal) {
//     new ModalBuilder("Hello, World!");
//   }
// });

console.log(
  new TextShader("Hello, World! ×5") // lo, Wor만 색칠되어야 하는데 아예 색칠이 안됨
  .applyShaders({
    'lo, Wor': [TextStyle.F_MAGENTA],
    '!': [TextStyle.F_CYAN]
  })
  .result
);
