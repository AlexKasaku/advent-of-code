import fs from 'fs';
import { EOL } from 'os';
import path from 'path';

//const file = './files/example.txt';
const file = './files/input.txt';

type Position = {
  x: number;
  y: number;
  height: number;
  start: boolean;
  end: boolean;
  visited: boolean;
  distance: number;
};
type Grid = Position[][];

const updatePosition = (position: Position, distance: number): void => {
  if (position.visited) return;

  if (distance < position.distance) position.distance = distance;
};

const updateNeighbours = (
  grid: Grid,
  { x, y, distance, height }: Position
): void => {
  // Find each position that is reachable and unvisited
  if (x > 0) {
    const candidate = grid[y][x - 1]!;

    if (candidate.height <= height + 1) updatePosition(candidate, distance + 1);
  }
  if (x < grid[y].length - 1) {
    const candidate = grid[y][x + 1]!;

    if (candidate.height <= height + 1) updatePosition(candidate, distance + 1);
  }
  if (y > 0) {
    const candidate = grid[y - 1][x]!;

    if (candidate.height <= height + 1) updatePosition(candidate, distance + 1);
  }
  if (y < grid.length - 1) {
    const candidate = grid[y + 1][x]!;

    if (candidate.height <= height + 1) updatePosition(candidate, distance + 1);
  }
};

const getHeight = (item: string) => {
  switch (item) {
    case 'S':
      return 1;
    case 'E':
      return 26;
  }

  return 'abcdefghijklmnopqrstuvwxyz'.split('').indexOf(item) + 1;
};

const parseInput = (input: string) =>
  input.split(EOL).map((line, y) =>
    line.split('').map((c, x) => ({
      x,
      y,
      height: getHeight(c),
      start: c === 'S' ? true : false,
      end: c === 'E' ? true : false,
      visited: false,
      distance: c === 'S' ? 0 : Number.MAX_SAFE_INTEGER,
    }))
  );
const start = async () => {
  const content = fs.readFileSync(path.join(__dirname, file), 'utf8');

  const grid: Grid = parseInput(content);
  const start = grid.flat().find((x) => x.start) || undefined;
  const end = grid.flat().find((x) => x.end) || undefined;

  if (!start) throw 'No start position!';
  if (!end) throw 'No end position!';

  while (true) {
    // Get next unvisited. This could be faster with sets...
    const candidate = grid
      .flat()
      .filter((x) => !x.visited)
      .sort((a, b) => a.distance - b.distance)
      .shift();

    // No grid spaces left to check
    if (!candidate) break;

    // Update neighbours
    updateNeighbours(grid, candidate);

    // Mark candidate as visited
    candidate.visited = true;
    //console.log(`Visited ${candidate.x},${candidate.y}`);

    if (candidate.end) {
      // Yay! We've reached the end
      break;
    }
  }

  // Part 1
  console.log(end.distance);
};

start();
