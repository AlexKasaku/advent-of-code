import { Grid } from '@utils/grid';
import { EOL } from 'os';
import { Space, SpaceWithPosition } from './types';
import transpose from '@utils/transpose';

export const parseInput = (input: string) => {
  const values = input.split(EOL).map((line) => line.split(''));

  return new Grid<Space>(values.length, values[0].length, ({ x, y }) => ({
    isGalaxy: values[y][x] == '#',
  }));
};

export const renderGrid = <T extends Space>(grid: Grid<T>): void => {
  for (const row of grid.Values)
    console.log(
      row.reduce((a, b) => a + (b.isGalaxy ? '⭐' : '⚫'), '' as string),
    );
  console.log();
};

export const expandSpace = (grid: Grid<Space>): Grid<Space> => {
  // Double every row or column that is completely empty. Make sure
  // we update height and width values.
  let gridValues = grid.Values;
  let gridHeight = grid.Height;
  let gridWidth = grid.Width;

  const expandRows = (height: number, width: number) => {
    for (let y = 0; y < height; y++) {
      const isEmpty = gridValues[y].every((s) => !s.isGalaxy);

      if (isEmpty) {
        // Add extra row
        gridValues.splice(
          y,
          0,
          [...new Array(width)].fill(0).map((_, i) => ({ isGalaxy: false })),
        );

        // Move y on and increase height
        y++;
        height++;
      }
    }
    return height;
  };

  gridHeight = expandRows(gridHeight, gridWidth);
  gridValues = transpose(gridValues);
  gridWidth = expandRows(gridWidth, gridHeight);
  gridValues = transpose(gridValues);

  return new Grid(gridHeight, gridWidth, ({ x, y }) => gridValues[y][x]);
};

export const createGridWithPositions = (
  grid: Grid<Space>,
): Grid<SpaceWithPosition> => {
  return new Grid(grid.Height, grid.Width, ({ x, y }) => ({
    x,
    y,
    ...grid.Values[y][x],
  }));
};
