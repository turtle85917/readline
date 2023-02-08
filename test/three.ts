import Readline, { ModalBuilder, PromptBuilder } from "../src";

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
    const modal = new ModalBuilder("Hello, World! 안녕, 세상! こんにちは世界！ It's just something I wrote down to write a long message, you can ignore it. I have to write down anything, but I don't know what to say, but I'm just saying anything to increase the length.");
    console.log(modal.result);
  }
});
