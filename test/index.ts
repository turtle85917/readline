import Readline, { PromptBuilder, TextStyle, Frame } from "../lib";

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
readline.processPrompts<"apple"|"reason", { apple: string; reason: string|undefined; }>([
  new PromptBuilder()
    .setType("select")
    .setName("apple")
    .setMessage("Do you like apple?")
    .setChoices([
      { title: "Yep", value: "yes" },
      { title: "No", value: "no" }
    ]),
  new PromptBuilder()
    .setType((value) => value === "no" ? "text" : null) // "value" variable comes in answer to the previous prompt request, "Do you like apple?"
    .setName("reason")
    .setMessage("Why?")
    .setInitial("Reason")
], ({ apple, reason }) => {
  appleLike = apple === "yes";
  if (!appleLike && reason !== undefined) process.stdout.write(`The reason you hate apples is because of "${reason}".`);
});
readline.addInputListener((data) => {
  if (data === "quit") process.exit();
  if (data === "shop") {
    readline.processPrompts<"shop", { shop: string[] }>([
      new PromptBuilder()
        .setType("multiselect")
        .setName("shop")
        .setMessage(`What will you buy? [money: ${money}]`)
        .setChoices(shopItems.filter(({ value }) => value !== "apple" || appleLike).map(shopItem => ({
          title: `${shopItem.icon} ${shopItem.name}`,
          value: shopItem.value,
          description: `${shopItem.price}won`,
          selected: shopItem.value === "apple" && shopItem.appleLike,
        })))
    ], ({ shop }) => {
      if (shop === undefined) return;
      if (shop.length === 0) {
        process.stdout.write("Didn't buy anything...");
        return;
      }
      let price = shop
        .filter(item => shopItems.filter(sitem => sitem.value === item).length)
        .map(item => shopItems.find(sitem => sitem.value === item)!.price)
        .reduce((prev, curr) => prev + curr, 0);
      if (money < price) process.stdout.write(`You don't have enough money...\n→ ${price} - ${Frame(`your: ${money}`, TextStyle.F_MAGENTA)} = ${Frame(`${(money-price).toLocaleString()}won`, TextStyle.F_RED)}`);
      else {
        money -= price;
        const plusAnsi = Frame("+)", TextStyle.F_BLUE);
        shop.forEach((item: string) => {
          inventoryNewItem(item);
          console.log(`| ${plusAnsi} You got an ${item}! (Now you have ${inventoryFindItem(item)!.quantity}!)`);
        });
        process.stdout.write(`└ ${plusAnsi} You have ${Frame(`${money}won`, TextStyle.BRIGHT)} left over from the buy. (${Frame(`-${price}won`, TextStyle.F_RED)})`);
      }
    });
  }
  if (data === "inventory") {
    process.stdout.write(Frame("In your current bag...", TextStyle.DIM));
    console.log(`\n${Frame("*)", TextStyle.F_CYAN)} 💰 ${money.toLocaleString()}won.`);
    inventory.forEach(item => {
      const currentItem = findItem(item.staticId)!;
      console.log(`${Frame("*)", TextStyle.F_CYAN)} ${currentItem.icon} ${currentItem.name} × ${item.quantity.toLocaleString()}`);
    });
  }
});
readline.addCloseListener(() => console.log("\nEnd readline."));

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
