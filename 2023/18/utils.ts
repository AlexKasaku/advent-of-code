import { CardinalDirection, Grid, Position } from '@utils/grid';
import { EOL } from 'os';
import { Space, Step } from './types';

const convertDirection = (direction: string): CardinalDirection => {
  switch (direction) {
    case '3':
    case 'U':
      return 'N';
    case '0':
    case 'R':
      return 'E';
    case '1':
    case 'D':
      return 'S';
    case '2':
    case 'L':
      return 'W';
  }
  throw 'Unsupported direction';
};

export const parseInput = (input: string, part2: boolean): Step[] => {
  return input.split(EOL).map((line) => {
    const match = line.match(/(\w) (\d+) \(#(.{6})\)/);
    if (!match) throw 'Unrecognized input on ' + line;

    if (!part2)
      return {
        direction: convertDirection(match[1]),
        value: parseInt(match[2]),
      };

    const code = match[3];

    return {
      direction: convertDirection(code[5]),
      value: parseInt(code.substring(0, 5), 16),
    };
  });
};

export const getPointsFromSteps = (steps: Step[]): Position[] => {
  const currentPos: Position = { x: 0, y: 0 };
  const points: Position[] = [{ x: 0, y: 0 }];
  for (const { direction, value } of steps) {
    switch (direction) {
      case 'N':
        currentPos.y -= value;
        break;
      case 'S':
        currentPos.y += value;
        break;
      case 'E':
        currentPos.x += value;
        break;
      case 'W':
        currentPos.x -= value;
        break;
    }
    points.push({ x: currentPos.x, y: currentPos.y });
  }
  return points;
};

export const caclculateBounds = (points: Position[]): [Position, Position] => {
  const minX = Math.min(...points.map((p) => p.x));
  const minY = Math.min(...points.map((p) => p.y));
  const maxX = Math.max(...points.map((p) => p.x));
  const maxY = Math.max(...points.map((p) => p.y));

  console.log(`Bounds: [${minX}, ${minY}] => [${maxX}, ${maxY}]}`);

  return [
    { x: minX, y: minY },
    { x: maxX, y: maxY },
  ];
};

export const buildGrid = (
  topLeft: Position,
  bottomRight: Position,
): Grid<Space> => {
  const width = bottomRight.x - topLeft.x + 1;
  const height = bottomRight.y - topLeft.y + 1;

  return new Grid<Space>(height, width, ({ x, y }) => ({ x, y, dug: false }));
};

export const digGrid = (
  grid: Grid<Space>,
  startingPosition: Position,
  steps: Step[],
) => {
  const currentPos: Position = startingPosition;
  const points: Position[] = [{ x: 0, y: 0 }];

  for (const { direction, value } of steps) {
    const toDig = grid.getAllInDirection(currentPos, direction, value);
    toDig.forEach((s) => {
      if (s!.dug) throw 'Already dug this part!';
      s!.dug = true;
    });

    switch (direction) {
      case 'N':
        currentPos.y -= value;
        break;
      case 'S':
        currentPos.y += value;
        break;
      case 'E':
        currentPos.x += value;
        break;
      case 'W':
        currentPos.x -= value;
        break;
    }
    points.push({ x: currentPos.x, y: currentPos.y });
  }
};

export const fillFromCenter = (grid: Grid<Space>): void => {
  const visited = new Set<Position>();
  const stack: Position[] = [
    { x: Math.floor(grid.Width / 2), y: grid.Height / 2 },
  ];

  while (stack.length > 0) {
    const point = stack.pop()!;

    visited.add(point);
    grid.get(point)!.dug = true;

    grid.forEachNeighbour(
      point,
      (neighbour, position) => {
        if (neighbour && !neighbour.dug && !visited.has(position))
          stack.push(position);
      },
      true,
    );
  }
};

export const renderGrid = (grid: Grid<Space>) => {
  for (const row of grid.Values)
    console.log(row.reduce((a, b) => a + (b.dug ? '⚫' : '🟤'), '' as string));
  console.log();
};
