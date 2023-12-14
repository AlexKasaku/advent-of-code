import { Grid } from '@utils/grid';
import { EOL } from 'os';
import { Space } from './types';

export const parseInput = (input: string): Grid<Space> => {
  const values = input.split(EOL).map((line) => line.split(''));

  return new Grid<Space>(values.length, values[0].length, ({ x, y }) => ({
    x,
    y,
    //char: values[y][x],
    isRock: values[y][x] !== '.',
    isStaticRock: values[y][x] === '#',
  }));
};

export const tiltGrid = (grid: Grid<Space>): void => {
  const rollableRocks = grid.Values.flat().filter(
    (s) => s.isRock && !s.isStaticRock,
  );

  for (const rock of rollableRocks) {
    // Look north to find first rock and move under that. As we're working top to bottom
    // we know all the rocks above us have already moved. If the space is undefined, we're at the
    // top already.
    const firstBlockedSpace = grid
      .getAllInDirection(rock, 'N')
      .find((s) => s?.isRock);
    const spaceUnderRock =
      firstBlockedSpace === undefined
        ? grid.get({ x: rock.x, y: 0 })
        : grid.get({ x: firstBlockedSpace.x, y: firstBlockedSpace.y + 1 });

    // Swap the rock and space over, if it's actually moved!
    if (spaceUnderRock !== rock) {
      spaceUnderRock!.isRock = true;
      rock.isRock = false;
    }
  }
};

export const renderGrid = (grid: Grid<Space>): void => {
  for (const row of grid.Values)
    console.log(
      row.reduce(
        (a, b) => a + (b.isRock ? (b.isStaticRock ? '⬜' : '🟡') : '⚫'),
        '' as string,
      ),
    );
  console.log();
};
