import transpose from '@utils/transpose';
import fs from 'fs';
import { findLastIndex } from 'lodash';
import { EOL } from 'os';
import path from 'path';

//const file = './files/example.txt';
const file = './files/input.txt';

type Tree = {
  height: number;
  visible: boolean;
  score: number;
};

const parseTrees = (input: string): Tree[][] =>
  input
    .split(EOL)
    .map((line) =>
      line
        .split('')
        .map((t) => ({ height: parseInt(t), visible: false, score: 1 }))
    );

const updateRow = (trees: Tree[]): void => {
  let highest = -1;
  for (let column = 0; column < trees.length; column++) {
    if (trees[column].height > highest) {
      trees[column].visible = true;
      highest = trees[column].height;
    }

    // Count how many trees until one that is same size or higher
    const adjacentTrees = trees.slice(0, column).reverse();

    if (adjacentTrees.length == 0) trees[column].score = 0;
    else {
      const index = adjacentTrees.findIndex(
        (t) => t.height >= trees[column].height
      );
      trees[column].score *= index == -1 ? adjacentTrees.length : index + 1;
    }
  }
};

const updateRows = (trees: Tree[][]): void => {
  // Read trees along each line of site and set visibility;
  for (let row = 0; row < trees.length; row++) {
    // Left -> Right
    updateRow(trees[row]);

    // Reverse row and update again to do Right -> Left
    const reversedRow = trees[row].reverse();
    updateRow(reversedRow);

    // Must reassign as reverse creates a new array
    trees[row] = reversedRow;
  }
};

const start = async () => {
  const content = fs.readFileSync(path.join(__dirname, file), 'utf8');

  const trees = parseTrees(content);

  // Process the rows, transpose and process again (to do columns)
  updateRows(trees);
  const transposedTrees = transpose(trees);
  updateRows(transposedTrees);

  // Part 1
  const totalVisible = trees.flatMap((row) =>
    row.filter((t) => t.visible)
  ).length;

  console.log(totalVisible);

  // Part 2
  const highestScore = trees
    .flatMap((row) => row.filter((t) => t.visible).map((t) => t.score))
    .sort((a, b) => b - a)[0];

  console.log(highestScore);
};

start();
