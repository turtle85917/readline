<h1 align="center">Funny terminal</h1>

<p align="center">
  <b>Developed for convenience when working with terminals.</b>
</p>

> Umm... In fact, this module is a project started to make the author comfortable when making games.

# Examples
```js
import FunnyTerminal from "funny-terminal";

const readline = new FunnyTerminal();
readline.processPrompts<"anything", { anything: string; }>([
  new PromptBuilder()
    .setType("text")
    .setName("anything") // Use the same as the generic name
    .setMessage("Write anything")
    .setInitial("I hate this module.")
], (value) => {
  if (value.anything === undefined) return;
  console.log(value.anything);
});
```

Read the documentation of [prompts package](https://npmjs.com/package/prompts) for more details.

<hr />

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

*Stop typing when the processPrompt is invoked.*

# Testcases
In **test/index.ts**...

<img src="https://raw.githubusercontent.com/turtle85917/readline/master/.github/imgs/testcase%231.gif">

In **test/second.ts**...

<img src="https://raw.githubusercontent.com/turtle85917/readline/master/.github/imgs/testcase%232.gif">

In **example/src/tictactoe.ts**...

<img src="https://raw.githubusercontent.com/turtle85917/readline/master/.github/imgs/tictactoe.gif">

# Packages used
|Name|License|Author|Note|
|:--:|:--:|:--:|:--:|
|[prompts](https://npmjs.com/package/prompts)|MIT|[Terkel](https://github.com/terkelg)|
|[cli-cursor](https://www.npmjs.com/package/cli-cursor)|MIT|[Sindre Sorhus](https://github.com/sindresorhus)|src/index.ts L#181 - Reference.|

# P.S.
It is a module for the **author's personal study** and is not recommended for use because it was developed to suit *author's coding style*. 😉
