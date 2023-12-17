import { EOL } from 'os';
import { Space } from './types';
import { Grid, Position } from '@utils/grid';

export const parseInput = (input: string): Grid<Space> => {
  const values = input.split(EOL).map((line) => line.split(''));

  return new Grid<Space>(values.length, values[0].length, ({ x, y }) => ({
    x,
    y,
    heatCost: parseInt(values[y][x]),
  }));
};

export const renderGrid = (grid: Grid<Space>, positions: Position[]) => {
  for (const row of grid.Values)
    console.log(
      row.reduce(
        (a, b) =>
          a +
          (positions.findIndex((p) => p.x === b.x && p.y === b.y) > -1
            ? '⚪'
            : '⚫'),
        '' as string,
      ),
    );
  console.log();
};
