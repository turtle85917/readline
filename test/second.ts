// This testcase is for pressing with keyboard keys.

// This game is "sokoban".
// 👉 https://en.wikipedia.org/wiki/Sokoban

import Readline, { TextStyle, putStyle } from "../lib";

const WIDTH = 10;
const HEIGHT = 6;
const block = "██";

let player = { block: putStyle(block, TextStyle.F_YELLOW), x: 1, y: 1 };
let status: Status = {
  block: putStyle(block, TextStyle.F_MAGENTA),
  goal: (g) => putStyle(block, g ? TextStyle.F_GREEN : TextStyle.F_RED),
  blocks: [{ x: 4, y: 2 }, { x: 7, y: 3 }, { x: 2, y: 1 }],
  goals: [{ x: 2, y: 5, g: false }, { x: 8, y: 1, g: false }, { x: 4, y: 3, g: false }]
}
let steps: Step[] = [];
let lastActions: Step[] = [];

const readline = new Readline();
readline.setCursorShow(false);
readline.setKeypressDisable(true);
readline.setOnlyDirectionKeys(true);
readline.setASDWIsDirectionKeys(true);
readline
  .addReadyListener(() => readline.coverMessage(getBoard()))
  .addActionListener((data) => {
    if (data.name === "submit") return;
    if (data.name === "undo") {
      let part = steps.slice(-3);
      if (part.every(step => step.kind === "player-move") && steps.length > 0) part = [part.at(-1)!];
      processSteps(part);
      readline.coverMessage(getBoard());
      return;
    }

    if (data.name === "redo") {
      processSteps(lastActions, false);
      lastActions = [];
      readline.coverMessage(getBoard());
      return;
    }

    let direction: Position = { x: 0, y: 0 };
    direction.x = data.name === "left" ? -1 : data.name === "right" ? 1 : 0;
    direction.y = data.name === "up" ? -1 : data.name === "down" ? 1 : 0;
    if (Object.values(direction).every(item => item === 0)) return;

    lastActions = [];
    steps.push({ kind: "player-move", x: player.x, y: player.y, index: 0 });
    player.x += direction.x;
    player.y += direction.y;

    status.blocks.forEach((block, index) => {
      const newblock = status.blocks.filter(item => item.x === block.x+direction.x && item.y === block.y+direction.y);
      if (block.x === player.x && block.y === player.y && newblock.length === 0) {
        steps.push({ kind: "box-move", x: block.x, y: block.y, index });
        block.x += direction.x;
        block.y += direction.y;
        const over = overWall(block);
        if (over.x) {
          block.x -= direction.x;
          player.x -= direction.x;
        }
        if (over.y) {
          block.y -= direction.y;
          player.y -= direction.y;
        }
      }
    });

    if (status.blocks.filter(item => item.x === player.x && item.y === player.y).length > 0) {
      player.x -= direction.x;
      player.y -= direction.y;
    }
    
    const over = overWall(player);
    if (over.x) player.x -= direction.x;
    if (over.y) player.y -= direction.y;

    status.goals.forEach((goal, index) => {
      if (steps.at(-1)?.kind === "box-move") steps.push({ kind: "box-goal", x: goal.x, y: goal.y, index, goal: goal.g });
      goal.g = status.blocks.filter(item => item.x === goal.x && item.y === goal.y).length > 0;
    });
    readline.coverMessage(getBoard());

    if (status.goals.every(item => item.g)) {
      readline.newLineToWirte("Game clear!");
      process.exit();
    }
  })
  .addCloseListener(() => console.log("\nEnd readline."));

function overWall(position: Position) {
  return {
    x: position.x < 0 || position.x >= WIDTH,
    y: position.y < 0 || position.y >= HEIGHT
  };
}

function processSteps(part: Step[], undo: boolean = true) {
  const targetArray = undo ? lastActions : steps;
  for (const step of part) {
    if (step.kind === "box-move") {
      const currentBlock = status.blocks[step.index];
      targetArray.push({ kind: "box-move", x: currentBlock.x, y: currentBlock.y, index: step.index });
      currentBlock.x = step.x;
      currentBlock.y = step.y;
      steps.pop();
    }
    if (step.kind === "box-goal") {
      const currentGoal = status.goals[step.index];
      targetArray.push({ kind: "box-goal", x: currentGoal.x, y: currentGoal.y, index: step.index });
      status.goals[step.index].g = step.goal ?? false;
      steps.pop();
    }
    if (step.kind === "player-move") {
      targetArray.push({ kind: "player-move", x: player.x, y: player.y, index: 0 });
      player.x = step.x;
      player.y = step.y;
      steps.pop();
    }
  }
}

function getBoard() {
  let result: string[] = [];
  for (let y = -1; y < HEIGHT+1; y++) {
    for (let x = -1; x < WIDTH+1; x++) {
      if (x === -1 || y === -1 || x === WIDTH || y === HEIGHT) result.push(block);
      else if (x === player.x && y === player.y) result.push(player.block);
      else {
        result.push("░░");
        for (const block of status.blocks) if (block.x === x && block.y === y) result[result.length-1] = status.block;
        for (const goal of status.goals) if (goal.x === x && goal.y === y) result[result.length-1] = status.goal(goal.g);
      }
    }
    result.push('\n');
  }

  return result.join('');
}

interface Step extends Position {
  kind: "box-move" | "box-goal" | "player-move";
  goal?: boolean;
  index: number;
  start?: boolean;
}

interface Position {
  x: number;
  y: number;
}

interface Status {
  block: string;
  goal: (g: boolean) => string;
  blocks: Position[];
  goals: (Position & { g: boolean; })[];
}
