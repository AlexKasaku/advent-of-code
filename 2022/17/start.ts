import { Grid, Position } from '@utils/grid';
import fs from 'fs';
import path from 'path';
import {
  HorizontalRock,
  LRock,
  PlusRock,
  Rock,
  SquareRock,
  VerticalRock,
} from './rock';
import { Space } from './types';
import { parseInput, renderGrid } from './utils';

//const file = './files/example.txt';
const file = './files/input.txt';

let rockIndex = 0;
const createRock = (position: Position, grid: Grid<Space>) => {
  let rock: Rock;
  switch (rockIndex) {
    case 0:
      rock = new HorizontalRock(position, grid);
      break;
    case 1:
      rock = new PlusRock(position, grid);
      break;
    case 2:
      rock = new LRock(position, grid);
      break;
    case 3:
      rock = new VerticalRock(position, grid);
      break;
    default:
    case 4:
      rock = new SquareRock(position, grid);
      break;
  }

  if (rockIndex == 4) rockIndex = 0;
  else rockIndex++;
  return rock;
};

const start = async () => {
  const content = fs.readFileSync(path.join(__dirname, file), 'utf8');

  const moves = parseInput(content);

  const chamber = new Grid<Space>(7, 100000, ({ x, y }) => ({
    x,
    y,
    isFilled: false,
  }));

  let rocksRemaining = 10000;
  let highestRock = 0;
  let currentRock: Rock | null = null;
  let movesRemaining = [...moves];

  var startTime = performance.now();

  while (rocksRemaining > 0) {
    // Do we have a rock to move?
    if (!currentRock) {
      // Spawn rock
      const spawnPosition = { x: 2, y: highestRock + 3 };
      currentRock = createRock(spawnPosition, chamber);
    } else {
      // Move the rock by jets
      const nextMove = movesRemaining.shift();

      // Restock move list if its now empty
      if (movesRemaining.length == 0) movesRemaining = [...moves];

      // Apply the move
      if (nextMove === 'L') {
        // Move left
        const moveLeft = currentRock.checkLeft();

        if (moveLeft) {
          currentRock.Position.x--;
        } else {
        }
      } else if (currentRock.checkRight()) {
        // Move right
        currentRock.Position.x++;
      } else {
      }

      // Check if can move down
      if (currentRock.checkDown()) {
        // Move down
        currentRock.Position.y--;
      } else {
        // Rock can't move, fill in the space

        currentRock.fillInSpace();
        if (currentRock.Position.y + currentRock.Shape.length > highestRock)
          highestRock = currentRock.Position.y + currentRock.Shape.length; // Shape-length represents height

        // Clear this rock and next loop we'll spawn another;
        currentRock = null;
        rocksRemaining--;
      }
    }
  }

  console.log(highestRock);
  console.log(`Execution took ${Math.round(performance.now() - startTime)} ms`);

  renderGrid(chamber, 20);
};

start();
