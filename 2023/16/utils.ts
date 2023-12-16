/* eslint-disable no-case-declarations */
import { CardinalDirection, Grid } from '@utils/grid';
import { EOL } from 'os';
import { PositionAndDirection, Space } from './types';
import range from '@utils/range';

export const parseInput = (input: string): Grid<Space> => {
  const values = input.split(EOL).map((line) => line.split(''));

  return new Grid<Space>(values.length, values[0].length, ({ x, y }) => ({
    x,
    y,
    char: values[y][x],
  }));
};

export const getNewPositions = (
  grid: Grid<Space>,
  thisPositionAndDirection: PositionAndDirection,
): PositionAndDirection[] => {
  // Determine where laser will go, which may be multiple new positions due to splitter.
  const space = grid.get(thisPositionAndDirection)!;
  const { x, y, direction } = thisPositionAndDirection;

  const newDirections: CardinalDirection[] = [];

  switch (space.char) {
    case '/':
      newDirections.push(
        direction == 'E'
          ? 'N'
          : direction == 'S'
            ? 'W'
            : direction == 'W'
              ? 'S'
              : 'E',
      );
      break;
    case '\\':
      newDirections.push(
        direction == 'E'
          ? 'S'
          : direction == 'S'
            ? 'E'
            : direction == 'W'
              ? 'N'
              : 'W',
      );
      break;
    case '|':
      if (direction == 'E' || direction == 'W') newDirections.push('N', 'S');
      else newDirections.push(direction);
      break;
    case '-':
      if (direction == 'N' || direction == 'S') newDirections.push('W', 'E');
      else newDirections.push(direction);
      break;
    case '.':
      newDirections.push(direction);
      break;
  }

  return newDirections
    .map((d) => {
      const space = grid.getAllInDirection({ x, y }, d, 1)?.[0];
      return space !== undefined
        ? { x: space.x, y: space.y, direction: d }
        : undefined;
    })
    .filter((d) => d !== undefined) as PositionAndDirection[];
};

export const getAllStartingPositionAndDirections = (
  grid: Grid<Space>,
): PositionAndDirection[] => {
  const positions: PositionAndDirection[] = [];

  // Add top + bottom edges
  positions.push(
    ...range(0, grid.Width - 1)
      .map((x) => [
        {
          x,
          y: 0,
          direction: 'S' as CardinalDirection,
        },
        {
          x,
          y: grid.Height - 1,
          direction: 'N' as CardinalDirection,
        },
      ])
      .flat(),
  );

  // Add side edges
  positions.push(
    ...range(0, grid.Height - 1)
      .map((y) => [
        {
          x: 0,
          y,
          direction: 'E' as CardinalDirection,
        },
        {
          x: grid.Width - 1,
          y,
          direction: 'W' as CardinalDirection,
        },
      ])
      .flat(),
  );

  return positions;
};
