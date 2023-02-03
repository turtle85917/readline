<h1 align="center">Funny terminal</h1>

<p align="center">
  <b>Developed for convenience when working with terminals.</b>
</p>

# Examples
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

*Stop typing when the processPrompt is invoked.*

# API
<h1>Constructors</h1>

<h3>constructor</h3>

> Initialization.

<h1>Properties</h1>

<h3><code style="font-size:10pt;">Optional</code> prompt?: <i>string</i></h3>
<h3>rline: <i>readline.Interface</i></h3>

<h1>Methods</h1>

<h3>addCloseListener</h3>

<span style="border: 1px solid">addCloseListener(listener: ((code: <i>number</i>) => <i>void</i>)): <i>void</i></span>

> To enable interaction with users.
<h4>Parameters</h4>

- listener: ((code: <i>number</i>) => <i>void</i>)
- > prompt array.
- <h4>Parameters</h4>
- - (code: <i>number</i>) => <i>void</i>
- - <h4>Parameters</h4>
- - - code: <i>number</i>
- - <h4>Returns <i>void</i></h4>
- <h4>Returns <i>void</i></h4>

# Packages used
|Name              |Author            |
|:----------------:|:----------------:|
|[prompts](https://npmjs.com/package/prompts)  MIT|[Terkel](https://github.com/terkelg)|

# P.S.
It is a module for the **author's personal study** and is not recommended for use because it was developed to suit *author's coding style*. 😉
