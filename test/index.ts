import Readline from "../lib";
import PromptBuilder from "../lib/PromptBuilder";

let appleLike = false;
let money = 3500;
const readline = new Readline();
const shopItems = [{ value: "apple", price: 500 }, { value: "cookie", price: 1500 }, { value: "banana", price: 850 }, { value: "orange", price: 1120 }, { value: "watermellon", price: 120 }]

readline.setPrompt("Input>");
readline.setAutoFocus(true);
readline.processPrompts([
  new PromptBuilder()
    .setType("select")
    .setName("apple")
    .setMessage("Do you like apple?")
    .setChoices([
      { title: "Yep", value: "yes" },
      { title: "No", value: "no" }
    ])
], (response) => appleLike = response.apple === "yes");
readline.addInputListener((data) => {
  readline.write(`Recived : ${data}\n`);
  if (data === "quit") process.exit();
  if (data === "shop") {
    readline.processPrompts<"shop">([
      new PromptBuilder()
        .setType("multiselect")
        .setName("shop")
        .setMessage(`What will you buy? [money: ${money}]`)
        .setChoices([
          appleLike ? { title: "🍎 Apple", value: "apple", description: "500won", selected: true } : { title: "🍪 Cookie", value: "cookie", description: "1500won" },
          { title: "🍌 Banana", value: "banana", description: "850won" },
          { title: "🍊 Orange", value: "orange", description: "1120won" },
          { title: "🍉 Watermellon", value: "watermellon", description: "120won" }
        ])
    ], (value) => {
      const price = (value.shop as string[])
        .filter(item => shopItems.filter(sitem => sitem.value === item).length)
        .map(item => shopItems.find(sitem => sitem.value === item)!.price)
        .reduce((prev, curr) => prev + curr, 0);
      if (money < price) readline.write(`You don't have enough money... You are ${(price-money).toLocaleString()}won short.`);
      else {
        money -= price;
        value.shop.forEach((item: string) => readline.write(`| \x1b[34m+\x1b[0m) You got an ${item}!\n`));
        readline.write(`└ \x1b[34m+\x1b[0m) You have ${money}won left over from the buy. (-${price}won)`);
      }
    });
  }
});
readline.addCloseListener(() => console.log("\nEnd readline."));
