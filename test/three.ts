import Readline, { ModalBuilder, PromptBuilder, TextShader, TextStyle } from "../lib";

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
  new TextShader("Jaimy) Hello! ×5")
  .applyShaders({
    'lo!': [TextStyle.F_CYAN]
  })
  .applyRules([
    { rule: /×\d+/, shaders: [TextStyle.F_YELLOW] },
    { rule: /([A-Z])\w+\)/, shaders: [TextStyle.F_MAGENTA] }
  ])
  .result
);
