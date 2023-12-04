import { createAndInitArray } from '@utils/createArray';
import toSum from '@utils/toSum';
import fs from 'fs';
import { EOL } from 'os';
import path from 'path';

//const file = './files/example.txt';
const file = './files/input.txt';

type Position = { x: number; y: number; z: number };

const posToString = ({ x, y, z }: Position) => `${x},${y},${z}`;

// Raises a callback for each orthagonally adjacent point in a grid to a position.
const forEachOrthagonalPoint = (
  point: Position,
  callback: (position: Position) => void,
) => {
  for (let x = point.x - 1; x <= point.x + 1; x++) {
    for (let y = point.y - 1; y <= point.y + 1; y++) {
      for (let z = point.z - 1; z <= point.z + 1; z++) {
        // Skip non-adjacent and yourself
        if (
          Math.abs(point.x - x) +
            Math.abs(point.y - y) +
            Math.abs(point.z - z) >
            1 ||
          (point.x == x && point.y == y && point.z == z)
        )
          continue;

        callback({ x, y, z });
      }
    }
  }
};

const addPointToGrid = (grid: number[][][], point: Position) => {
  // Add into grid with 6 sides
  grid[point.x][point.y][point.z] = 6;

  // Now reduce all surrounding cubes, including this one
  // for each one found
  forEachOrthagonalPoint(point, ({ x, y, z }) => {
    if (grid?.[x]?.[y]?.[z] > 0) {
      grid[x][y][z]--;
      grid[point.x][point.y][point.z]--;
    }
  });
};

const start = async () => {
  const content = fs.readFileSync(path.join(__dirname, file), 'utf8');

  const points = content.split(EOL).map((line) => {
    const [x, y, z] = line.split(',');
    return { x: parseInt(x), y: parseInt(y), z: parseInt(z) };
  });

  const gridSize = 100;
  const height = gridSize;
  const depth = gridSize;
  const width = gridSize;

  const grid: number[][][] = createAndInitArray(() => -2, width, height, depth);

  for (const point of points) {
    addPointToGrid(grid, point);
  }

  // Part 2:

  // Starting from outside, flood-fill all orthagonally reachable spaces with -1
  // to show that they are reachable from outside

  // Track all visited spaces in a set, and places to visit in a stack
  const visited = new Set<string>();
  const stack: Position[] = [{ x: 0, y: 0, z: 0 }];

  while (stack.length > 0) {
    const point = stack.pop()!;

    // Mark as visited and fill in with -1 to mark it as outside
    visited.add(posToString(point));
    grid[point.x][point.y][point.z] = -1;

    forEachOrthagonalPoint(point, ({ x, y, z }) => {
      // Add position if empty and not visited
      if (grid?.[x]?.[y]?.[z] == -2 && !visited.has(posToString({ x, y, z }))) {
        stack.push({ x, y, z });
      }
    });
  }

  // "Fill in insides" by adding new blocks into all remaining positions that -2,
  // which means there weren't points in the input but also can't be reached from outside,
  // so they are air pockets.
  for (let x = 0; x < width; x++) {
    for (let y = 0; y < height; y++) {
      for (let z = 0; z < depth; z++) {
        if (grid[x][y][z] === -2) {
          addPointToGrid(grid, { x, y, z });
        }
      }
    }
  }

  // Now calculate sides by adding up all spaces that aren't -2 or -1
  const sides = grid
    .flat(2)
    .filter((x) => x > -1)
    .reduce(toSum);

  console.log(sides);
};

start();
