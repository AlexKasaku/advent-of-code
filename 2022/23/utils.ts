import { Grid, Position } from '@utils/grid';
import { EOL } from 'os';
import { Direction, Elf, MaybeElf } from './types';

export const parseInput = (input: string): [Grid<MaybeElf>, Elf[]] => {
  const gridPositions = input.split(EOL).map((line) => line.split(''));
  const gridBuffer = 1000;

  const elves: Elf[] = [];
  const grid: Grid<MaybeElf> = new Grid<MaybeElf>(
    gridPositions.length + 2 * gridBuffer,
    gridPositions[0].length + 2 * gridBuffer
  );

  // Much quicker to initialize by entering elves due to the buffer.
  for (let y = 0; y < gridPositions.length; y++)
    for (let x = 0; x < gridPositions[y].length; x++) {
      const elf = { x: x + gridBuffer, y: y + gridBuffer };
      grid.set(elf, elf);
      elves.push(elf);
    }

  return [grid, elves];
};

export const updateDirectionsToConsider = (
  directionsToConsider: Direction[]
) => {
  // Rotate directions
  directionsToConsider.push(directionsToConsider.shift()!);
};

export const positionToString = ({ x, y }: Position): string => `${x},${y}`;
export const stringToPosition = (val: string): Position => {
  const [x, y] = val.split(',');
  return { x: parseInt(x), y: parseInt(y) };
};

export const findNewPosition = (
  grid: Grid<MaybeElf>,
  { x, y }: Elf,
  directionsToConsider: Direction[]
): Position | undefined => {
  for (const direction of directionsToConsider) {
    switch (direction) {
      case 'N':
        if (
          grid.get({ x, y: y - 1 }) === undefined && // N
          grid.get({ x: x + 1, y: y - 1 }) === undefined && // NE
          grid.get({ x: x - 1, y: y - 1 }) === undefined // NW
        ) {
          return { x, y: y - 1 };
        }
      case 'S':
        if (
          grid.get({ x, y: y + 1 }) === undefined && // S
          grid.get({ x: x + 1, y: y + 1 }) === undefined && // SE
          grid.get({ x: x - 1, y: y + 1 }) === undefined // SW
        ) {
          return { x, y: y + 1 };
        }
      case 'W':
        if (
          grid.get({ x: x - 1, y }) === undefined && // W
          grid.get({ x: x - 1, y: y - 1 }) === undefined && // NW
          grid.get({ x: x - 1, y: y + 1 }) === undefined // SW
        ) {
          return { x: x - 1, y };
        }
      case 'E':
        if (
          grid.get({ x: x + 1, y }) === undefined && // E
          grid.get({ x: x + 1, y: y - 1 }) === undefined && // NE
          grid.get({ x: x + 1, y: y + 1 }) === undefined // SE
        ) {
          return { x: x + 1, y };
        }
    }
  }

  // No suitable direction to move to
  return undefined;
};

export const renderPartialGrid = (
  grid: Grid<MaybeElf>,
  minX: number,
  maxX: number,
  minY: number,
  maxY: number
) => {
  for (let y = minY; y <= maxY; y++) {
    for (let x = minX; x <= maxX; x++) {
      process.stdout.write(grid.get({ x, y }) !== undefined ? '#' : '.');
    }
    console.log();
  }
};
