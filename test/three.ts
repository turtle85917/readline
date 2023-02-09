import Readline, { ModalBuilder, PromptBuilder, TextStyle } from "../src";

const readline = new Readline();
readline.processPrompts<"openModal", { openModal: "open" | "no"; }>([
  new PromptBuilder()
    .setType("select")
    .setName("openModal")
    .setMessage("Would you like to open the modal?")
    .setChoices([
      { title: "Open modal", value: "open" },
      { title: "No", value: "no" }
    ])
], ({ openModal }) => {
  if (openModal === "open") {
    const modal = new ModalBuilder("Hello, World! 안녕, 세상! こんにちは世界！ It's just something I wrote down to write a long message, you can ignore it. I have to write down anything, but I don't know what to say, but I'm just saying anything to increase the length.", [
      { name: "Change text", shaders: [TextStyle.F_MAGENTA], key: { name: 'c', action() {
        modal.setMessage("Hello, World!");
        modal.coverMessage(modal.result)
      } } },
      { name: "Quit", shaders: [TextStyle.F_RED], key: { name: 'q', action: () => process.exit() } }
    ]);
    console.log(modal.result);
  }
});
