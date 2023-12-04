import { createAndInitArray, createArray } from '@utils/createArray';
import toSum from '@utils/toSum';
import { EOL } from 'os';

export const parsePoints = (input: string) => {
  let maxX = 0,
    maxY = 0;

  const points = input.split(EOL).map((line) => {
    const points = line.split(',');
    const [x, y] = [parseInt(points[0]), parseInt(points[1])];

    if (x > maxX) maxX = x;
    if (y > maxY) maxY = y;

    return [x, y];
  });

  const grid = createAndInitArray(() => false, maxY + 1, maxX + 1);

  for (const [x, y] of points) grid[y][x] = true;

  return grid;
};

export const parseFolds = (input: string) =>
  input.split(EOL).map((line) => {
    const split = line.split('=');
    return { axis: split[0][split[0].length - 1], point: parseInt(split[1]) };
  });

export const foldOn = (
  grid: boolean[][],
  xAxis: boolean,
  position: number,
): boolean[][] => {
  if (xAxis) {
    const baseSegment = grid.map((row) => row.slice(0, position));
    const foldedSegment = grid.map((row) => row.slice(position + 1).reverse());

    // Apply fold
    for (let y = 0; y < baseSegment.length; y++) {
      baseSegment[y] = baseSegment[y] || [];
      foldedSegment[y] = foldedSegment[y] || [];

      for (
        let x = 0;
        x < Math.max(foldedSegment[y].length, baseSegment[y].length);
        x++
      ) {
        const index = baseSegment[0].length - foldedSegment[0].length + x;
        baseSegment[y][index] ||= foldedSegment[y][x];
      }
    }

    return baseSegment;
  } else {
    const baseSegment = grid.slice(0, position);
    const foldedSegment = grid.slice(position + 1).reverse();

    // Apply fold
    for (let y = 0; y < foldedSegment.length; y++) {
      const index = baseSegment.length - foldedSegment.length + y;
      baseSegment[index] = baseSegment[index] || [];
      foldedSegment[y] = foldedSegment[y] || [];

      for (
        let x = 0;
        x < Math.max(baseSegment[y].length, foldedSegment[y].length);
        x++
      ) {
        baseSegment[index][x] ||= foldedSegment[y][x];
      }
    }

    return baseSegment;
  }
};

export const visibleDots = (grid: boolean[][]) =>
  grid
    .flat()
    .map((x) => (x ? 1 : (0 as number)))
    .reduce(toSum);

export const renderGrid = (grid: boolean[][]) => {
  for (const row of grid) {
    for (const cell of row) {
      process.stdout.write(cell ? '🟡' : '⚫');
    }
    console.log();
  }
  console.log();
};
