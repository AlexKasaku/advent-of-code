import { Grid } from '@utils/grid';
import { EOL } from 'os';
import { Space } from './types';

export const parseInput = (input: string): Grid<Space> => {
  const values = input.split(EOL).map((line) => line.split(''));

  return new Grid<Space>(values.length, values[0].length, ({ x, y }) => ({
    x,
    y,
    value: parseInt(values[y][x]),
    visited: false,
    distance: Number.MAX_SAFE_INTEGER,
  }));
};
