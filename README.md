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

<h3><code>prompt</code>?: <i>string</i></h3>
<h3><code>rline</code>: <i>readline.Interface</i></h3>

<h1>Methods</h1>

<h3>addReadyListener</h3>
<span>addReadyListener(() => <i>void</i>)): <i>void</i></span>
> Call the listener when setup finished.

<h4>Parameters</h4>

- listener: (() => <i>void</i>)
- > Listener to invoke.
- <h4>Returns <i>this</i></h4>

<h3>addInputListener</h3>
<span>addInputListener(listener: ((data: <i>string</i>) => <i>void</i>)): <i>void</i></span>

> Call the listener when input is complete.
<h4>Parameters</h4>

- listener: ((data: <i>string</i>) => <i>void</i>)
- > Listener to invoke.
- <h4>Parameters</h4>
- - (code: <i>number</i>) => <i>void</i>
- - <h4>Parameters</h4>
- - - data: <i>string</i>
- - <h4>Returns <i>void</i></h4>
- <h4>Returns <i>this</i></h4>  

<h3>addActionListener</h3>
<span>addActionListener(listener: ((data: <i>ActionData</i>) => <i>void</i>)): <i>void</i></span>

> Call the listener when a key on keyboard is pressed.
<h4>Parameters</h4>

- listener: ((data: <i>ActionData</i>) => <i>void</i>)
- > Listener to invoke.
- <h4>Parameters</h4>
- - (code: <i>number</i>) => <i>void</i>
- - <h4>Parameters</h4>
- - - data: <i>ActionData</i>
- - <h4>Returns <i>void</i></h4>
- <h4>Returns <i>this</i></h4>  

<h3>addCloseListener</h3>
<span>addCloseListener(listener: ((code: <i>number</i>) => <i>void</i>)): <i>void</i></span>

> Specifies whether to automatically scroll down after user input is complete.
<h4>Parameters</h4>

- listener: ((code: <i>number</i>) => <i>void</i>)
- > Listener to invoke.
- <h4>Parameters</h4>
- - (code: <i>number</i>) => <i>void</i>
- - <h4>Parameters</h4>
- - - code: <i>number</i>
- - <h4>Returns <i>void</i></h4>
- <h4>Returns <i>this</i></h4>

<h3>setAutoFocus</h3>
<span>setAutoFocus(value: <i>boolean</i>): <i>void</i></span>

> Specifies whether to automatically scroll down after user input is complete.
<h4>Parameters</h4>

- value: <i>boolean</i>
- > Value.
- <h4>Returns <i>void</i></h4>

<h3>setPrompt</h3>
<span>setPrompt(value: <i>string</i>): <i>void</i></span>

> Set prompt.
<h4>Parameters</h4>

- value: <i>string</i>
- > Value.
- <h4>Returns <i>void</i></h4>

# Packages used
|Name              |Author            |
|:----------------:|:----------------:|
|[prompts](https://npmjs.com/package/prompts)  MIT|[Terkel](https://github.com/terkelg)|

# P.S.
It is a module for the **author's personal study** and is not recommended for use because it was developed to suit *author's coding style*. 😉
