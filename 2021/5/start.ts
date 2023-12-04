import range from '@utils/range';
import transpose from '@utils/transpose';
import fs from 'fs';
import { EOL } from 'os';
import path from 'path';

//const file = './files/example.txt';
const file = './files/input.txt';

type Point = { x: number; y: number };
type Line = {
  start: Point;
  end: Point;
};

const toLines = (line: string): Line => {
  const [start, end] = line.split(' -> ');

  const toPoint = (part: string): Point => {
    const [x, y] = part.split(',').map((x) => parseInt(x));
    return { x, y };
  };

  return { start: toPoint(start), end: toPoint(end) };
};

const orthagonal = ({ start, end }: Line) =>
  start.x === end.x || start.y === end.y;

const interpolate = ({ start, end }: Line): Point[] => {
  const xRange = range(start.x, end.x);
  const yRange = range(start.y, end.y);

  if (xRange.length > 1 && yRange.length > 1) {
    // Diagonal
    const points = transpose([xRange, yRange]).map((a) => ({
      x: a[0],
      y: a[1],
    }));

    return points;
  }

  const points = [];

  for (const x of xRange) for (const y of yRange) points.push({ x, y });

  return points;
};

const groupByDuplicate = (acc: Record<string, number>, item: Point) => {
  const pointKey = `x${item.x}y${item.y}`;

  if (acc[pointKey]) acc[pointKey]++;
  else acc[pointKey] = 1;

  return acc;
};

const start = async () => {
  const content = fs.readFileSync(path.join(__dirname, file), 'utf8');

  const points = content
    .split(EOL)
    .map(toLines)
    //.filter(orthagonal)
    .map(interpolate)
    .flat();

  console.log(`Flattend into ${points.length} points`);

  const pointOccurences = points.reduce(groupByDuplicate, {});
  const duplicatePoints = Object.entries(pointOccurences).filter(
    (o) => o[1] > 1,
  );
  console.log(duplicatePoints.length);
};

start();
