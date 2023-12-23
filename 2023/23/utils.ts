import { Grid, Position } from '@utils/grid';
import { EOL } from 'os';
import { Space } from './types';

export const parseInput = (input: string): Grid<Space> => {
  const values = input.split(EOL).map((line) => line.split(''));

  return new Grid<Space>(values.length, values[0].length, ({ x, y }) => ({
    x,
    y,
    char: values[y][x],
    isWall: values[y][x] === '#',
  }));
};

export const renderGrid = (grid: Grid<Space>, positions: Set<Position>) => {
  for (const row of grid.Values)
    console.log(
      row.reduce(
        (a, b) => a + (b.isWall ? '🧱' : positions.has(b) ? '⭐' : '⚫'),
        '' as string,
      ),
    );
  console.log();
};
