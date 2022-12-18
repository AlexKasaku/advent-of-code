import toSum from '@utils/toSum';
import fs from 'fs';
import { EOL } from 'os';
import path from 'path';

//const file = './files/example.txt';
const file = './files/input.txt';

type Position = { x: number; y: number; z: number };

const start = async () => {
  const content = fs.readFileSync(path.join(__dirname, file), 'utf8');

  const points = content.split(EOL).map((line) => {
    const [x, y, z] = line.split(',');
    return { x: parseInt(x), y: parseInt(y), z: parseInt(z) };
  });

  const gridSize = 50;
  const height = gridSize;
  const depth = gridSize;
  const width = gridSize;

  const grid: number[][][] = [...Array(height)].map(() =>
    [...Array(width)].map(() => new Array(depth).fill(0))
  );

  for (const point of points) {
    // Add into grid with 6 sides
    grid[point.x][point.y][point.z] = 6;

    // Now reduce all surrounding cubes, including this one
    // for each one found
    for (let x = point.x - 1; x <= point.x + 1; x++) {
      for (let y = point.y - 1; y <= point.y + 1; y++) {
        for (let z = point.z - 1; z <= point.z + 1; z++) {
          // Skip non-adjacent
          if (
            Math.abs(point.x - x) +
              Math.abs(point.y - y) +
              Math.abs(point.z - z) >
            1
          )
            continue;

          // Skip yourself!
          if (point.x == x && point.y == y && point.z == z) continue;

          if (grid?.[x]?.[y]?.[z] > 0) {
            grid[x][y][z]--;
            grid[point.x][point.y][point.z]--;
          }
        }
      }
    }
  }

  // Now add up all sides
  const sides = grid.flat(2).reduce(toSum);

  console.log(sides);
};

start();
