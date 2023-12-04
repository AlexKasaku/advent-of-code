import fs from 'fs';
import { EOL } from 'os';
import path from 'path';

//const file = './files/example.txt';
const file = './files/input.txt';

const part1 = true;

type Position = {
  x: number;
  y: number;
  height: number;
  start: boolean;
  end: boolean;
  visited: boolean;
  distance: number;
  manhattanDistanceToEnd: number;
};
type Grid = Position[][];

const parseInput = (input: string) =>
  input.split(EOL).map((line, y) =>
    line.split('').map((c, x) => ({
      x,
      y,
      height: getHeight(c),
      start: c === 'S' ? true : false,
      end: c === 'E' ? true : false,
      visited: false,
      distance: Number.MAX_SAFE_INTEGER,
      manhattanDistanceToEnd: 0,
    })),
  );

const updatePosition = (position: Position, distance: number): void => {
  if (position.visited) return;

  if (distance < position.distance) position.distance = distance;
};

const isReachable = (
  currentHeight: number,
  candidateHeight: number,
): boolean =>
  part1
    ? currentHeight >= candidateHeight - 1
    : currentHeight - 1 <= candidateHeight;

const updateNeighbours = (
  grid: Grid,
  { x, y, distance, height }: Position,
): void => {
  // Find each position that is reachable and unvisited
  if (x > 0) {
    const candidate = grid[y][x - 1]!;

    if (isReachable(height, candidate.height))
      updatePosition(candidate, distance + 1);
  }
  if (x < grid[y].length - 1) {
    const candidate = grid[y][x + 1]!;

    if (isReachable(height, candidate.height))
      updatePosition(candidate, distance + 1);
  }
  if (y > 0) {
    const candidate = grid[y - 1][x]!;

    if (isReachable(height, candidate.height))
      updatePosition(candidate, distance + 1);
  }
  if (y < grid.length - 1) {
    const candidate = grid[y + 1][x]!;

    if (isReachable(height, candidate.height))
      updatePosition(candidate, distance + 1);
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

const setManhattanDistances = (grid: Grid, { x, y }: Position) => {
  grid.flat().forEach((g) => {
    g.manhattanDistanceToEnd = Math.abs(g.x - x) + Math.abs(g.y - y);
  });
};

const start = async () => {
  const content = fs.readFileSync(path.join(__dirname, file), 'utf8');

  const grid: Grid = parseInput(content);
  const start = grid.flat().find((x) => x.start) || undefined;
  const end = grid.flat().find((x) => x.end) || undefined;

  if (!start) throw 'No start position!';
  if (!end) throw 'No end position!';

  // Part 1. From start to end:
  if (part1) start.distance = 0;

  // Part 2. From end to first with height A
  if (!part1) end.distance = 0;

  // Set Manhattan Distances, which we'll use to prioritise what spaces to look at next
  setManhattanDistances(grid, end);

  let iterations = 0;
  while (true) {
    iterations++;

    // Get next unvisited. This could be faster with sets...
    const candidate = grid
      .flat()
      .filter((x) => !x.visited)
      .sort(
        (a, b) =>
          a.distance +
          a.manhattanDistanceToEnd -
          (b.distance + b.manhattanDistanceToEnd),
      )
      .shift();

    // No grid spaces left to check if there isn't one remaining or "closest" is still at Infinity (unreachable). Need
    // to check this also to account for blocked off areas.
    if (!candidate || candidate.distance === Infinity) {
      console.log(`Breaking early on candidate ${candidate}`);
      break;
    }

    // Update neighbours
    updateNeighbours(grid, candidate);

    // Mark candidate as visited
    candidate.visited = true;

    if ((part1 && candidate.end) || (!part1 && candidate.height == 1)) {
      // Yay! We're done
      console.log(candidate);
      break;
    }
  }

  console.log(`Found in ${iterations} iterations.`);
};

start();
