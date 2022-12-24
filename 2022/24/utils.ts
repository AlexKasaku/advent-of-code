import { Grid, Position } from '@utils/grid';
import range from '@utils/range';
import { EOL } from 'os';
import { Blizzard, InitialSetup, Space } from './types';

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
      distanceToEnd: manhattanDistance({ x, y }, end),
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

export const manhattanDistance = (a: Position, b: Position) =>
  Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
