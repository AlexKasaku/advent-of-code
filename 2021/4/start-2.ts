import chunk from '@utils/chunk';
import transpose from '@utils/transpose';
import fs from 'fs';
import { EOL } from 'os';
import path from 'path';

//const file = './files/example.txt';
const file = './files/input.txt';

type Board = string[][];

const readBoards = (lines: string[]): Board[] =>
  chunk(lines, 6).map((boardData) =>
    boardData.slice(0, 5).map((row) =>
      row
        .split(' ')
        .filter((x) => x)
        .map((x) => x.trim()),
    ),
  );

const updateBoards = (boards: Board[], move: string) =>
  boards.map((board) => {
    board.forEach((row, rowIndex) =>
      row.forEach((cell, cellIndex) => {
        if (cell === move) board[rowIndex][cellIndex] = '';
      }),
    );

    return board;
  });

const getWinners = (boards: Board[], complete: boolean = true): Board[] =>
  boards.filter(
    (board) =>
      (board.some((row) => row.every((cell) => cell === '')) ||
        transpose(board).some((row) => row.every((cell) => cell === ''))) ===
      complete,
  );

const getWinningBoardValue = (board: Board): number =>
  board.flat().reduce((a, b) => a + (b !== '' ? parseInt(b) : 0), 0);

const start = async () => {
  const content = fs.readFileSync(path.join(__dirname, file), 'utf8');
  const lines = content.split(EOL);

  const moves = lines[0].split(',');
  let boards = readBoards(lines.slice(2));

  for (const move of moves) {
    console.log('Playing move ' + move);

    const incompleteBoards = getWinners(boards, false);

    boards = updateBoards(boards, move);

    const completeBoards = getWinners(boards);

    if (completeBoards.length === boards.length) {
      console.log('Last board won!');

      const lastBoardComplete = incompleteBoards[0];

      console.log(lastBoardComplete);
      console.log(getWinningBoardValue(lastBoardComplete) * parseInt(move));

      return;
    }
  }
};

start();
