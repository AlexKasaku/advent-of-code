import { Grid } from '@utils/grid';
import { EOL } from 'os';
import { Octopus } from './types';

export const parseInput = (input: string): Grid<Octopus> => {
  const values = input.split(EOL).map((line) => line.split(''));

  return new Grid<Octopus>(values.length, values[0].length, ({ x, y }) => ({
    x,
    y,
    flashed: false,
    value: parseInt(values[y][x]),
  }));
};
