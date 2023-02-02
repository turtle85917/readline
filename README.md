<h1 align="center">Funny terminal</h1>

<p align="center">
  <b>Developed for convenience when working with terminals.</b>
</p>

# Example
```js
import FunnyTerminal from "funny-terminal";

const readline = new FunnyTerminal();
readline.processPrompts<"anything", { anything: string; }>([
  new PromptBuilder()
    .setType("text")
    .setName("anything") // Use the same as the generic name
    .setMessage("Write anything")
    .setInitial("I hate this module")
], (value) => {
  if (value.anything === undefined) return;
  console.log(value.anything);
});
```

Read the documentation of [prompts package](https://npmjs.com/package/prompts) for more details.
** **
```js
import FunnyTerminal from "funny-terminal";

const readline = new FunnyTerminal();
readline.setPrompt("Input>");
readline.setAutoFocus(true); //  Automatically scrolls the screen. Default value is `true`.
readline.addInputListener((data) => {
  if (data === "quit") process.exit();
  console.log(`Recived : ${data}`);
})
  .addCloseListener(() => console.log("Quit."));
```

***Stop typing*** if prcessPrompts is called.

# Packages used
|Name              |Author            |
|:----------------:|:----------------:|
|[prompts](https://npmjs.com/package/prompts)  MIT|[Terkel](https://github.com/terkelg)|

# P.S.
It is a module for the **author's personal study** and is not recommended for use because it was developed to suit *author's coding style*. 😉
