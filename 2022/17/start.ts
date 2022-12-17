import { Grid } from '@utils/grid';
import fs from 'fs';
import { EOL } from 'os';
import path from 'path';
import { HorizontalRock, Rock } from './rock';
import { Space } from './types';
import { parseInput } from './utils';

const file = './files/example.txt';
//const file = './files/input.txt';

const start = async () => {
  const content = fs.readFileSync(path.join(__dirname, file), 'utf8');

  const moves = parseInput(content);

  const chamber = new Grid<Space>(7, 5000, ({ x, y }) => ({
    x,
    y,
    isFilled: false,
  }));

  let rocksRemaining = 2022;
  let highestRock = 0;
  let currentRock: Rock | null = null;
  let movesRemaining = [...moves];

  while (rocksRemaining > 0) {
    // Do we have a rock to move?
    if (!currentRock) {
      // Spawn rock
      const spawnPosition = { x: 2, y: highestRock + 3 };
      currentRock = new HorizontalRock(spawnPosition, chamber);
    } else {
      // Move the rock by jets
      const nextMove = movesRemaining.shift();

      // Restock move list if its now empty
      if (movesRemaining.length == 0) movesRemaining = [...moves];

      // Apply the move
      if (nextMove === 'L' && currentRock.checkLeft()) {
        // Move left
        currentRock.Position.x--;
      } else if (currentRock.checkRight()) {
        // Move right
        currentRock.Position.x++;
      }

      // Check if can move down
      if (currentRock.checkDown()) {
        // Move down
        currentRock.Position.y--;
      } else {
        // Rock can't move, fill in the space
        currentRock.fillInSpace();
        highestRock = currentRock.Position.y;

        // Clear this rock and next loop we'll spawn another;
        currentRock = null;
        rocksRemaining--;
      }
    }
  }

  console.log(highestRock);
  //console.dir(chamber.Values, { depth: null });
};

start();
