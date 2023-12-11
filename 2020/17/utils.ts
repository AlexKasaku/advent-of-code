import { Grid3D } from '@utils/grid3d';
import { EOL } from 'os';
import { Cube } from './types';

export const parseInput = (input: string) => {
  const values = input.split(EOL).map((line) => line.split(''));

  // Create inital grid, with a buffer of 1 around all sides.
  const grid = new Grid3D<Cube>(
    values.length + 2,
    values[0].length + 2,
    3,
    ({ x, y, z }) => ({
      x,
      y,
      z,
      isActive: false,
    }),
  );

  // Now put the cubes from the file in the middle of the grid.
  for (let y = 0; y < values.length; y++) {
    for (let x = 0; x < values[0].length; x++) {
      if (values[y][x] === '#') grid.Values[1][1 + y][1 + x].isActive = true;
    }
  }

  return grid;
};

export const expandGrid = (grid: Grid3D<Cube>): Grid3D<Cube> => {
  // Performs a naive expand by adding 1 to every edge (therefore growing 2 for each dimension)
  // A more sophisticated approach might only expand where cubes are at the edge.

  return new Grid3D<Cube>(
    grid.Height + 2,
    grid.Width + 2,
    grid.Depth + 2,
    ({ x, y, z }) => ({
      x,
      y,
      z,
      isActive: grid.get({ x: x - 1, y: y - 1, z: z - 1 })?.isActive ?? false,
    }),
  );
};

export const renderGrid = (grid: Grid3D<Cube>): void => {
  let z = 0;
  for (const depthSlice of grid.Values) {
    console.log(z);
    for (const row of depthSlice)
      console.log(row.reduce((a, b) => a + (b.isActive ? '🟡' : '⚫'), ''));
    z++;
  }
  console.log();
};
