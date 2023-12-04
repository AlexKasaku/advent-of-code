import { Grid } from '@utils/grid';
import { EOL } from 'os';
import { Space } from './types';

export const parseInputPart2 = (input: string): Grid<Space> => {
  const values = input.split(EOL).map((line) => line.split(''));

  return new Grid<Space>(
    values.length * 5,
    values[0].length * 5,
    ({ x, y }) => {
      const yIndex = Math.floor(y / values.length);
      const xIndex = Math.floor(x / values[0].length);

      const value =
        ((parseInt(values[y % values.length][x % values[0].length]) +
          yIndex +
          xIndex -
          1) %
          9) +
        1;
      return {
        x,
        y,
        value,
        visited: false,
        distance: Number.MAX_SAFE_INTEGER,
      };
    },
  );
};

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
