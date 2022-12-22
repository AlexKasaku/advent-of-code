import { Position } from '@utils/grid';
import fs from 'fs';
import path from 'path';
import { Direction } from './types';
import {
  moveOnGrid,
  parseInput,
  turn,
  renderGrid,
  createWrapMapExample,
} from './utils';

const file = './files/example.txt';
//const file = './files/input.txt';

const logPosition = (position: Position, facing: Direction) =>
  console.log(`At: ${position.x}, ${position.y} Facing: ${facing}`);

const getFacingValue = (facing: Direction): number => {
  switch (facing) {
    case 'R':
      return 0;
    case 'D':
      return 1;
    case 'L':
      return 2;
    case 'U':
      return 3;
  }
};

const start = async () => {
  const content = fs.readFileSync(path.join(__dirname, file), 'utf8');

  const [moves, grid] = parseInput(content);

  grid.log();

  console.log('Width: ' + grid.Values[0].length);
  console.log('Height: ' + grid.Values.length);

  let currentPosition: Position = grid.Values[0].find(
    (space) => space.content == 'open'
  )!;
  let facing: Direction = 'R';

  const wrapMap = createWrapMapExample(
    grid.Values[0].length,
    grid.Values.length
  );

  logPosition(currentPosition, facing);
  while (moves.length) {
    const move = moves.shift()!;

    console.log('Perfoming: ' + move);

    if (typeof move == 'number') {
      const { position: newPosition, facing: newFacing } = moveOnGrid(
        grid,
        currentPosition,
        facing,
        move,
        wrapMap
      );

      currentPosition = newPosition;
      facing = newFacing;
    } else {
      facing = turn(facing, move);
    }

    logPosition(currentPosition, facing);
  }

  renderGrid(grid);

  // Calculate score
  const score =
    (currentPosition.y + 1) * 1000 +
    (currentPosition.x + 1) * 4 +
    getFacingValue(facing);

  console.log(score);
};

start();
