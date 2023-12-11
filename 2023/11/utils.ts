import { Grid } from '@utils/grid';
import { EOL } from 'os';
import { Space } from './types';

export const parseInput = (input: string) => {
  const values = input.split(EOL).map((line) => line.split(''));

  return new Grid<Space>(values.length, values[0].length, ({ x, y }) => ({
    x,
    y,
    isGalaxy: values[y][x] == '#',
  }));
};

export const renderGrid = (grid: Grid<Space>): void => {
  for (const row of grid.Values)
    console.log(
      row.reduce((a, b) => a + (b.isGalaxy ? '⭐' : '⚫'), '' as string),
    );
  console.log();
};
