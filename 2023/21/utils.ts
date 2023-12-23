import { Grid, Position } from '@utils/grid';
import { EOL } from 'os';
import { Space } from './types';

export const parseInput = (input: string): [Grid<Space>, Position] => {
  const values = input.split(EOL).map((line) => line.split(''));

  let startSpace: Position;
  const grid = new Grid<Space>(values.length, values[0].length, ({ x, y }) => {
    if (values[y][x] === 'S') startSpace = { x, y };
    return {
      x,
      y,
      isRock: values[y][x] === '#',
      visited: false,
      visitedOnStep: null,
    };
  });

  return [grid, startSpace!];
};

export const parseInputPart2 = (input: string, scale: number): Grid<Space> => {
  const values = input.split(EOL).map((line) => line.split(''));

  const grid = new Grid<Space>(
    values.length * scale,
    values[0].length * scale,
    ({ x, y }) => {
      return {
        x,
        y,
        isRock: values[y % values.length][x % values[0].length] === '#',
        visited: false,
        visitedOnStep: null,
      };
    },
  );

  return grid;
};

export const renderGrid = (grid: Grid<Space>, onEven: boolean): void => {
  for (const row of grid.Values)
    console.log(
      row.reduce(
        (a, b) =>
          a +
          (b.isRock
            ? '🧱'
            : b.visited && (!onEven || b.visitedOnStep! % 2 === 1)
              ? '🟡'
              : '⚫'),
        '' as string,
      ),
    );
  console.log();
};
