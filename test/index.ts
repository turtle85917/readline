import Readline from "../lib";
import PromptBuilder from "../lib/promptBuilder";

let money = 3500;
let inventory: Inventory[] = [];
let appleLike = false;
const readline = new Readline();
const shopItems: ShopItem[] = [
  { icon: "🍎", name: "Apple", value: "apple", price: 500, appleLike: true },
  { icon: "🍪", name: "Cookie", value: "cookie", price: 1500, appleLike: false },
  { icon: "🍌", name: "Banana", value: "banana", price: 850 },
  { icon: "🍊", name: "Orange", value: "orange", price: 230 },
  { icon: "🍉", name: "Watemelon", value: "watermelon", price: 1200 }
];

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
  if (data === "quit") process.exit();
  if (data === "shop") {
    readline.processPrompts<"shop">([
      new PromptBuilder()
        .setType("multiselect")
        .setName("shop")
        .setMessage(`What will you buy? [money: ${money}]`)
        .setChoices(shopItems.filter(sitem => sitem.value === "apple" ? appleLike : true).map(shopItem => ({
          title: `${shopItem.icon} ${shopItem.name}`,
          value: shopItem.value,
          description: `${shopItem.price}won`,
          selected: shopItem.value === "apple" && shopItem.appleLike,
        })))
    ], (value) => {
      if (value.shop === undefined) return;
      let price = (value.shop as string[])
        .filter(item => shopItems.filter(sitem => sitem.value === item).length)
        .map(item => shopItems.find(sitem => sitem.value === item)!.price)
        .reduce((prev, curr) => prev + curr, 0);
      if (money < price) readline.write(`You don't have enough money...\n→ ${price} - ${ansiFrame(`your: ${money}`, TextStyle.F_MAGENTA)} = ${ansiFrame(`${(money-price).toLocaleString()}won`, TextStyle.F_RED)}`);
      else {
        money -= price;
        const plusAnsi = ansiFrame("+)", TextStyle.F_BLUE);
        value.shop.forEach((item: string) => {
          inventoryNewItem(item);
          console.log(`| ${plusAnsi} You got an ${item}! (Now you have ${inventoryFindItem(item)!.quantity}!)`);
        });
        readline.write(`└ ${plusAnsi} You have ${money}won left over from the buy. (${ansiFrame(`-${price}won`, TextStyle.F_RED)})`);
      }
    });
  }
  if (data === "inventory") {
    readline.write(ansiFrame("In your current bag...", TextStyle.DIM));
    console.log(`\n${ansiFrame("*)", TextStyle.F_CYAN)} ${money.toLocaleString()}won.`);
    inventory.forEach(item => {
      const currentItem = findItem(item.staticId)!;
      console.log(`\n${ansiFrame("*)", TextStyle.F_CYAN)} ${currentItem.icon} ${currentItem.name} × ${item.quantity.toLocaleString()}`);
    });
  }
});
readline.addCloseListener(() => console.log("\nEnd readline."));

export const ansiFrame = (value: string, ...styles: number[]) => {
  return `\x1b[${styles.join(';')}m${value}\x1b[0m`;
}

const inventoryNewItem = (item: string) => {
  if (inventoryFindItem(item) === undefined) inventory.push({ staticId: item, quantity: 0 });
  inventory.find(i => i.staticId === item)!.quantity++;
}

const inventoryFindItem = (item: string) => inventory.find(i => i.staticId === item);
const findItem = (staticId: string) => shopItems.find(i => i.value === staticId);

interface ShopItem {
  icon: string;
  name: string;
  value: string;
  price: number;
  appleLike?: boolean;
}

interface Inventory {
  staticId: string;
  quantity: number;
}

export enum TextStyle {
  NORMAL,
  BRIGHT,
  DIM,
  UNDERSCORE = 4,

  F_BLACK = 30,
  F_RED,
  F_GREEN,
  F_YELLOW,
  F_BLUE,
  F_MAGENTA,
  F_CYAN,
  F_WHITE,

  B_BLACK = 40,
  B_RED,
  B_GREEN,
  B_YELLOW,
  B_BLUE,
  B_MAGENTA,
  B_CYAN,
  B_WHITE
}
