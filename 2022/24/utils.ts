import { Grid, Position } from '@utils/grid';
import { EOL } from 'os';
import { Blizzard, InitialSetup, Space } from './types';

export const parseInput = (input: string): InitialSetup => {
  const gridContent = input.split(EOL).map((line) => line.split(''));

  const start = { x: 1, y: 0 };
  const end = {
    x: gridContent[0].length - 2,
    y: gridContent.length - 1,
  };

  const height = gridContent.length;
  const width = gridContent[0].length;

  const blizzards: Blizzard[] = [];
  for (let y = 0; y < gridContent.length; y++)
    for (let x = 0; x < gridContent[y].length; x++) {
      switch (gridContent[y][x]) {
        case '^':
          blizzards.push({
            start: { x, y },
            current: { x, y },
            direction: 'U',
          });
          break;
        case 'v':
          blizzards.push({
            start: { x, y },
            current: { x, y },
            direction: 'D',
          });
          break;
        case '<':
          blizzards.push({
            start: { x, y },
            current: { x, y },
            direction: 'L',
          });
          break;
        case '>':
          blizzards.push({
            start: { x, y },
            current: { x, y },
            direction: 'R',
          });
          break;
      }
    }

  return { width, height, start, end, blizzards };
};

export const buildGridFromState = (
  width: number,
  height: number,
  start: Position,
  end: Position,
  blizzards: Blizzard[]
): Grid<Space> => {
  const grid = new Grid<Space>(height, width, ({ x, y }) => {
    const space = {
      x,
      y,
      blizzards: [] as Blizzard[],
      wall: false,
      start: false,
      end: false,
    };
    if (x == 0 || x == width - 1 || y == 0 || y == height - 1)
      space.wall = true;
    return space;
  });

  grid.get(start)!.start = true;
  grid.get(end)!.end = true;

  for (const blizzard of blizzards)
    grid.get(blizzard.current)!.blizzards.push(blizzard);

  return grid;
};

const getRenderChar = (space: Space): string => {
  if (space.start || space.end) return '.';
  if (space.wall) return '#';
  if (space.blizzards.length > 1) return space.blizzards.length.toString();
  if (space.blizzards.length == 0) return '.';

  switch (space.blizzards[0].direction) {
    case 'U':
      return '^';
    case 'R':
      return '>';
    case 'D':
      return 'v';
    case 'L':
      return '<';
  }
};

export const renderGrid = (grid: Grid<Space>): void => {
  for (const row of grid.Values) {
    for (const space of row) {
      process.stdout.write(getRenderChar(space));
    }
    console.log();
  }
};
