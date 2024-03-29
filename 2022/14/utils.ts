import { Grid } from '@utils/grid';
import range from '@utils/range';
import { byAscending, byDescending } from '@utils/sort';
import { EOL } from 'os';
import { ContentType, Line, Point, Space } from './types';

export const toLines = (line: string): Line[] => {
  const toPoint = (part: string): Point => {
    const [x, y] = part.split(',').map((x) => parseInt(x));
    return { x, y };
  };

  return line.split(' -> ').reduce((lines, point, index, array) => {
    if (index < array.length - 1)
      lines.push({ start: toPoint(point), end: toPoint(array[index + 1]) });

    return lines;
  }, [] as Line[]);
};

export const interpolate = ({ start, end }: Line): Point[] => {
  const xRange = range(start.x, end.x);
  const yRange = range(start.y, end.y);

  const points = [];

  for (const x of xRange) for (const y of yRange) points.push({ x, y });

  return points;
};

export const parsePoints = (content: string) =>
  content
    .split(EOL)
    .map(toLines)
    .flat()
    //.filter(orthagonal)
    .map(interpolate)
    .flat();

export const createGridFromPoints = (
  points: Point[],
  addFloor: boolean = false,
): Grid<Space> => {
  // Get size of grid
  // Do we need to ensure grid is as small as possible?
  const minX = points.map((p) => p.x).sort(byAscending)[0];
  const maxX = points.map((p) => p.x).sort(byDescending)[0];
  const minY = points.map((p) => p.y).sort(byAscending)[0];
  const maxY = points.map((p) => p.y).sort(byDescending)[0];

  console.log(`Boundaries: ${minX},${minY} -> ${maxX},${maxY}`);

  const floorYBuffer = addFloor ? 2 : 0;
  const floorXBuffer = addFloor ? 300 : 0;
  const grid = new Grid<Space>(
    maxX + 1 + floorXBuffer,
    maxY + 1 + floorYBuffer,
    ({ x, y }) => ({ x, y, content: null }),
  );

  for (const point of points) {
    grid.get(point)!.content = 'rock';
  }

  if (addFloor) {
    for (const point of grid.Values[maxY + floorYBuffer])
      point.content = 'rock';
  }

  return grid;
};

export const getChar = (content: ContentType): string => {
  switch (content) {
    case 'rock':
      return '🧱';
    case 'sand':
      return '🟡';
  }

  return '⚫';
};

export const getNextPointForSand = (
  grid: Grid<Space>,
  point: Point,
): Point | 'off' | 'rest' => {
  // Determine the next point for the sand

  // Look below
  const below = checkPoint(grid, { x: point.x, y: point.y + 1 });
  if (below != 'blocked') return below;

  // Look lower-left
  const lowerLeft = checkPoint(grid, { x: point.x - 1, y: point.y + 1 });
  if (lowerLeft != 'blocked') return lowerLeft;

  // Look lower-right
  const lowerRight = checkPoint(grid, { x: point.x + 1, y: point.y + 1 });
  if (lowerRight != 'blocked') return lowerRight;

  // Exhaused options, rest
  return 'rest';
};

const checkPoint = (
  grid: Grid<Space>,
  point: Point,
): 'blocked' | 'off' | Point => {
  const space = grid.get(point);

  // If nothing, is off grid
  if (!space) return 'off';

  // If no content, can move there
  if (!space.content) return space;

  return 'blocked';
};

export const renderGrid = (grid: Grid<Space>): void => {
  // Example
  const minY = 0;
  const maxY = 11; // 9 for Part 1
  const minX = 488;
  const maxX = 513;

  // Input
  //   const minY = 10;
  //   const maxY = 174;
  //   const minX = 472;
  //   const maxX = 573;

  process.stdout.write('\x1Bc');
  for (let y = minY; y <= maxY; y++) {
    for (let x = minX; x <= maxX; x++)
      process.stdout.write(getChar(grid.Values[y][x].content));

    console.log();
  }
};
