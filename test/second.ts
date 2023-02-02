// This test case is for pressing with keyboard keys.

// This game is "sokoban".
// 👉 https://en.wikipedia.org/wiki/Sokoban

import Readline from "../src";
import { TextStyle } from "./enum/TextStyle";
import { ansiFrame } from "./utils/ansiFrame";

const WIDTH = 10;
const HEIGHT = 5;
const blocks = ["░░", "██"];
let board = new Array(WIDTH * HEIGHT).fill(0);

let player = { block: ansiFrame("██", TextStyle.F_YELLOW), x: 1, y: 1 };
let status: Status = {
  block: ansiFrame("██", TextStyle.F_MAGENTA),
  goal: (g) => ansiFrame("██", g ? TextStyle.F_GREEN : TextStyle.F_RED),
  blocks: [{ x: 4, y: 2 }],
  goals: [{ x: 2, y: 3, g: false }]
}

const readline = new Readline();
readline
  .addReadyListener(() => {
    process.stdout.write(getBoard());
  })
  .addActionListener((data) => {
    let direction: Position = { x: 0, y: 0 };
    direction.x += data.name === "left" ? -1 : 1;
    direction.y += data.name === "up" ? -1 : 1;
    player.x += direction.x;
    player.y += direction.y;
    process.stdout.write(getBoard());
  })
  .addCloseListener(() => console.log("\nEnd readline."));

function getBoard() {
  let result: string[] = [];
  for (let y = -1; y < HEIGHT+1; y++) {
    for (let x = -1; x < WIDTH+1; x++) {
      if (x === -1 || y === -1 || x === WIDTH || y === HEIGHT) result.push(blocks.at(-1)!);
      else if (x === player.x && y === player.y) result.push(player.block);
      else {
        result.push(blocks[board[y * WIDTH + x]]);
        for (const block of status.blocks) if (block.x === x && block.y === y) result[result.length-1] = status.block;
        for (const goal of status.goals) if (goal.x === x && goal.y === y) result[result.length-1] = status.goal(goal.g);
      }
    }
    result.push('\n');
  }

  return result.join('');
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
