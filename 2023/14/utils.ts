import { Direction, Grid } from '@utils/grid';
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

const getRocksInOrder = (grid: Grid<Space>, direction: Direction): Space[] => {
  // To ensure no clashes we need to process the rocks in the right order.
  let rocks: Space[] = [];

  switch (direction) {
    case 'N':
    case 'W':
      // Top-to-bottom, left-to-right
      rocks = grid.Values.flat().filter((s) => s.isRock && !s.isStaticRock);
      break;

    case 'S':
      // Bottom-to-top, left-to-right
      for (let rowIndex = grid.Height - 1; rowIndex >= 0; rowIndex--) {
        rocks.push(
          ...grid.Values[rowIndex].filter((s) => s.isRock && !s.isStaticRock),
        );
      }
      break;

    case 'E':
      // Top-to-bottom, right-to-left
      for (const row of grid.Values)
        rocks.push(
          ...[...row].filter((s) => s.isRock && !s.isStaticRock).reverse(),
        );
      break;
  }

  return rocks;
};

export const tiltGrid = (grid: Grid<Space>, direction: Direction): void => {
  const rollableRocks = getRocksInOrder(grid, direction);

  for (const rock of rollableRocks) {
    const aheadOfRock = grid.getAllInDirection(rock, direction);
    const firstBlockedIndex = aheadOfRock.findIndex((s) => s?.isRock);

    let destination: Space | undefined = undefined;
    if (firstBlockedIndex > 0) {
      destination = aheadOfRock[firstBlockedIndex - 1]!;
    } else if (firstBlockedIndex == -1) {
      // Move to edge
      destination = aheadOfRock[aheadOfRock.length - 1]!;
    } else {
      // Index is 0, which means we're not moving as we're already blocked.
    }

    // Swap the rock and space over, if it's actually moved!
    if (destination) {
      destination.isRock = true;
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
