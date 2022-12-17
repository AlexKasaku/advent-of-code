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

const logPostion = (currentRock: Rock) => {
  console.log(`Rock at ${JSON.stringify(currentRock.Position)}`);
};

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
      currentRock = createRock(spawnPosition, chamber);
      console.log(`Rock spawned at ${JSON.stringify(currentRock.Position)}`);
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
          //console.log('Moved left');
          currentRock.Position.x--;
          //logPostion(currentRock);
        } else {
          //console.log("Couldn't move left");
        }
      } else if (currentRock.checkRight()) {
        // Move right
        //console.log('Moved right');
        currentRock.Position.x++;
        //logPostion(currentRock);
      } else {
        //console.log("Couldn't move right");
      }

      // Check if can move down
      if (currentRock.checkDown()) {
        // Move down
        //console.log('Falling');
        currentRock.Position.y--;

        //logPostion(currentRock);
      } else {
        // Rock can't move, fill in the space
        console.log('Stopping');
        logPostion(currentRock);

        currentRock.fillInSpace();
        if (currentRock.Position.y + currentRock.Shape.length > highestRock)
          highestRock = currentRock.Position.y + currentRock.Shape.length; // Shape-length represents height
        console.log(highestRock);

        // Clear this rock and next loop we'll spawn another;
        currentRock = null;
        rocksRemaining--;
      }
    }
  }

  console.log(highestRock);

  renderGrid(chamber, 20);

  //console.dir(chamber.Values, { depth: null });
};

start();
