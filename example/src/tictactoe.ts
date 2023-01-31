import FunnyTerminal from "funny-terminal";

let turn = 'O';
let board = [[' ', ' ', ' '], [' ', ' ', ' '], [' ', ' ', ' ']];
const boardToString = () => board.map(tiles => tiles.map(tile => ` ${tile} `).join('|')).join("\n-----------\n");

const readline = new FunnyTerminal();
readline.setAutoFocus(true);
readline.setPrompt("Location>");

console.log(boardToString());

readline.addInputListener(input => {
  if (input === "quit") process.exit();
  const position = input.slice(1, -1).split(',').map(Number);
  const pass = invaildRequest(!/\(\d,( |)\d\)/.test(input)) || invaildRequest(position[0] < 1 || position[0] > 3 || position[1] < 1 || position[1] > 3) || invaildRequest(board[position[1]-1][position[0]-1] !== ' ', true);
  if (pass) return;

  board[position[1]-1][position[0]-1] = turn;
  console.log(boardToString());
  requestExit();
  turn = turn === 'O' ? 'X' : 'O';
  console.log(`Now it's player ${turn}'s turn.`);
});

const invaildRequest = (reason: boolean, placed: boolean = false) => {
  if (reason) {
    console.log([
      boardToString(),
      placed ? "It's where it's already been placed." : "Invaild location."
    ].join('\n'));
    return true;
  }
  return false;
}

const requestExit = () => {
  if (!checkWin(turn) && !checkDraw()) return;
  process.stdout.write(checkDraw() ? "Draw..." : `Winner is player ${turn}.`);
  process.exit();
}

function checkWin(target: string) {
  const checkCols = (list: string[]) => list.every(item => item === target);
  const checkRows = (list: string[][]) => list.some(items => checkCols(items));
  const filtering = (calc?: (idx: number) => number) => board.map((tiles, idx) => tiles[calc?.(idx) ?? idx]);
  return checkRows(board) || checkCols(filtering()) || checkCols(filtering(idx => Math.max(2-idx, 0))) || checkRows(board.slice(0, 3).reduce((p, c) => p.map((a, i) => [...a, c[i]]), Array(3).fill([])));
}

function checkDraw() {
  return !checkWin('O') && !checkWin('X') && board.every(items => items.every(item => item !== ' '));
}
