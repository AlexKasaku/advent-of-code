import { EOL } from 'os';
import { Space } from './types';
import { Grid } from '@utils/grid';

export const renderGrid = (grid: Grid<Space>, loopOnly: boolean): void => {
  for (const row of grid.Values)
    console.log(
      row.reduce(
        (a, b) =>
          a +
          (loopOnly
            ? b.isLoop
              ? b.char
              : b.isInsideLoop
                ? 'X'
                : '.'
            : b.char),
        '' as string,
      ),
    );
  console.log();
};

export const parseInput = (input: string) => {
  const values = input.split(EOL).map((line) => line.split(''));

  return new Grid<Space>(values.length, values[0].length, ({ x, y }) => ({
    x,
    y,
    char: values[y][x],
    isPipe: values[y][x] != '.',
    isLoop: false,
    isInsideLoop: false,
    startSpaceAltChar: '',
  }));
};
