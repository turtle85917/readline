<h1 align="center">Funny terminal</h1>

<p align="center">
  <b>Developed for convenience when working with terminals.</b>
</p>

> Umm... In fact, this module is a project started to make the author comfortable when making games.
> 
> Since I am Korean, I use a translator quite a lot. You may see sloppy English grammar.

# Examples
```js
import FunnyTerminal, { PromptBuilder } from "funny-terminal";

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
readline.setAutoFocus(true); // Automatically scrolls the screen. Default value is `true`.
readline.addInputListener((data) => {
  if (data === "quit") process.exit();
  console.log(`Recived : ${data}`);
})
  .addCloseListener(() => console.log("Quit."));
```

*Stop typing when the processPrompt is invoked.*

<hr />

```js
import FunnyTerminal from "funny-terminal";

const readline = new FunnyTerminal();
readline.setCursorShow(false);
readline.setKeypressDisable(true);
readline
  .addReadyListener(() => readline.coverMessage("Test message #1"))
  .addActionListener(data => {
    /**
      data: `object`
      ├ name: `string`
      └ key: `object`
        ├ sequence: `string`
        ├ name: `string`
        ├ ctrl: `boolean`
        ├ meta: `boolean`
        ├ shift: `boolean`
        └ code: `string`
    */
    if (data.name === "left") readline.coverMessage("Test message #0"); // Left Arrow Key.
    if (data.name === "right") readline.coverMessage("Test message #1");// Right Arrow Key.
  });
```

Please check test/second.ts for more details.

<hr />

```js
import { TextShader, TextStyle } from "funny-terminal";

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
```

*Result:*

<img src="https://raw.githubusercontent.com/turtle85917/readline/master/.github/imgs/textshader.png">

`.applyShaders` : Only specified text parts can be colored.

`.applyRules` : Specifies the color of a string with rules.

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

***I hate this module.***
