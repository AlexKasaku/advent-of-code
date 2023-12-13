import { Grid } from '@utils/grid';
import { EOL } from 'os';
import { Space } from './types';

export const parseInput = (input: string): Grid<Space>[] => {
  const patterns = input.split(EOL + EOL);

  return patterns.map((pattern) => {
    const values = pattern.split(EOL).map((line) => line.split(''));

    return new Grid<Space>(values.length, values[0].length, ({ x, y }) => ({
      x,
      y,
      isRock: values[y][x] === '#',
    }));
  });
};

export const findReflectionRowIndex = (
  patternVaues: Space[][],
  skipIndex?: number,
): number => {
  let index = -1;

  // The reflection lies between two rows. The index is inclusive of the first half,
  // so an index of 3 means rows 0,1,2,3 are in first half.

  // Turn the grid into a series of string rows for easy comparison
  const stringRows = patternVaues.map((row) => rowToString(row));

  for (let rowIndex = 0; rowIndex < stringRows.length; rowIndex++) {
    let delta = 0;
    let foundReflection = true;

    // To confirm if reflection, check rows and keep working until out of the grid
    // on one side.
    do {
      const row1 = stringRows[rowIndex - delta];
      const row2 = stringRows[rowIndex + 1 + delta];

      if (row1 != row2) {
        foundReflection = false;
        break;
      }
      delta++;
    } while (rowIndex - delta >= 0 && rowIndex + 1 + delta < stringRows.length);

    if (
      foundReflection &&
      (skipIndex === undefined || skipIndex !== rowIndex)
    ) {
      index = rowIndex;
      break;
    }
  }

  return index;
};

export const rowToString = (values: Space[]): string =>
  values.reduce((a, b) => a + (b.isRock ? '#' : '.'), '');

export const renderGrid = (grid: Grid<Space>): void => {
  for (const row of grid.Values)
    console.log(
      row.reduce((a, b) => a + (b.isRock ? '⚪' : '⚫'), '' as string),
    );
  console.log();
};
