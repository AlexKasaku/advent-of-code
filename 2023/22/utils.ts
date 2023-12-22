import { EOL } from 'os';
import { BrickPosition, Space } from './types';
import { byDescending } from '@utils/sort';
import { Grid } from '@utils/grid';
import { Grid3D } from '@utils/grid3d';

export const parseInput = (input: string): BrickPosition[] => {
  return input.split(EOL).map((l) => {
    const regex = /(\d+),(\d+),(\d+)~(\d+),(\d+),(\d+)/;
    const match = l.match(regex);
    if (!match) throw 'Could not parse line';

    return {
      end1: {
        x: parseInt(match[1]),
        y: parseInt(match[2]),
        z: parseInt(match[3]),
      },
      end2: {
        x: parseInt(match[4]),
        y: parseInt(match[5]),
        z: parseInt(match[6]),
      },
    };
  });
};

export const orderBricksByLowest = (bricks: BrickPosition[]): void => {
  bricks.sort(
    (a, b) => Math.min(a.end1.z, a.end2.z) - Math.min(b.end1.z, b.end2.z),
  );
};

export const buildGrid = (bricks: BrickPosition[]): Grid3D<Space> => {
  const bounds = getBounds(bricks);
  const { xMax, yMax, zMax } = bounds;

  return new Grid3D<Space>(yMax + 1, xMax + 1, zMax + 1, ({ x, y, z }) => ({
    x,
    y,
    z,
    brick: null,
  }));
};

export const getBounds = (
  bricks: BrickPosition[],
): {
  xMax: number;
  yMax: number;
  zMax: number;
} => {
  return {
    xMax: bricks.map((b) => Math.max(b.end1.x, b.end2.x)).sort(byDescending)[0],
    yMax: bricks.map((b) => Math.max(b.end1.y, b.end2.y)).sort(byDescending)[0],
    zMax: bricks.map((b) => Math.max(b.end1.z, b.end2.z)).sort(byDescending)[0],
  };
};

// export const renderGrid = (grid: Grid3D<Space>): void => {
//   // Side view
//   for (const row of grid.Values)
//     console.log(
//       row.reduce(
//         (a, b) =>
//           a +
//           (b.isRock
//             ? '🧱'
//             : b.visited && (!onEven || b.visitedOnStep! % 2 === 1)
//               ? '🟡'
//               : '⚫'),
//         '' as string,
//       ),
//     );
//   console.log();
// };
