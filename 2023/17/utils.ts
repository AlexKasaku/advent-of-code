import { EOL } from 'os';
import { Space } from './types';
import { Grid } from '@utils/grid';

export const parseInput = (input: string): Grid<Space> => {
  const values = input.split(EOL).map((line) => line.split(''));

  return new Grid<Space>(values.length, values[0].length, ({ x, y }) => ({
    x,
    y,
    heatCost: parseInt(values[y][x]),
  }));
};
