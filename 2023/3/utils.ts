import { Grid } from '@utils/grid';
import { EOL } from 'os';
import { EngineSpace } from './types';

export const parseInput = (input: string): Grid<EngineSpace> => {
  const values = input.split(EOL).map((line) => line.split(''));

  return new Grid<EngineSpace>(values.length, values[0].length, ({ x, y }) => {
    const space: EngineSpace = {
      x,
      y,
      adjacent: false,
      value: parseInt(values[y][x]),
    };
    if (Number.isNaN(space.value)) space.value = undefined;
    if (space.value == undefined && values[y][x] != '.')
      space.symbol = values[y][x];

    return space;
  });
};
