import { Grid, Position } from '@utils/grid';
import range from '@utils/range';
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

  for (const blizzard of blizzards) {
    //console.log(blizzard);
    grid.get(blizzard.current)!.blizzards.push(blizzard);
  }

  return grid;
};

export const getBlizzardsAtStep = (
  width: number,
  height: number,
  initialBlizzards: Blizzard[],
  step: number
): Blizzard[] => {
  const playWidth = width - 2;
  const playHeight = height - 2;
  return initialBlizzards.map((blizzard) => {
    switch (blizzard.direction) {
      case 'R':
        return {
          ...blizzard,
          current: {
            x: 1 + ((blizzard.current.x - 1 + (step % playWidth)) % playWidth),
            y: blizzard.current.y,
          },
        };
      case 'L':
        return {
          ...blizzard,
          current: {
            x:
              1 +
              ((playWidth + blizzard.current.x - 1 - (step % playWidth)) %
                playWidth),
            y: blizzard.current.y,
          },
        };
      case 'U':
        return {
          ...blizzard,
          current: {
            x: blizzard.current.x,
            y:
              1 +
              ((playHeight + blizzard.current.y - 1 - (step % playHeight)) %
                playHeight),
          },
        };
      case 'D':
        return {
          ...blizzard,
          current: {
            x: blizzard.current.x,
            y:
              1 + ((blizzard.current.y - 1 + (step % playHeight)) % playHeight),
          },
        };
    }
  });
};
export const buildAllGridStates = (setup: InitialSetup, uniqueStates: number) =>
  range(0, uniqueStates - 1).map((i) =>
    buildGridFromState(
      setup.width,
      setup.height,
      setup.start,
      setup.end,
      getBlizzardsAtStep(setup.width, setup.height, setup.blizzards, i)
    )
  );

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
