import { Grid } from '@utils/grid';
import fs from 'fs';
import path from 'path';
import { Space } from './types';
import { parseInput, parseInputPart2 } from './utils';

//const file = './files/example.txt';
const file = './files/input.txt';

const updatePosition = (position: Space, distance: number): void => {
  if (position.visited) return;

  if (distance < position.distance) position.distance = distance;
};

const updateNeighbours = (
  grid: Grid<Space>,
  { x, y, distance, value }: Space,
  unvisited: Set<Space>
): void => {
  // Find each position that is reachable and unvisited
  if (x > 0) {
    const candidate = grid.Values[y][x - 1]!;

    if (!candidate.visited) unvisited.add(candidate);
    updatePosition(candidate, distance + candidate.value);
  }
  if (x < grid.Values[y].length - 1) {
    const candidate = grid.Values[y][x + 1]!;

    if (!candidate.visited) unvisited.add(candidate);
    updatePosition(candidate, distance + candidate.value);
  }
  if (y > 0) {
    const candidate = grid.Values[y - 1][x]!;

    if (!candidate.visited) unvisited.add(candidate);
    updatePosition(candidate, distance + candidate.value);
  }
  if (y < grid.Values.length - 1) {
    const candidate = grid.Values[y + 1][x]!;

    if (!candidate.visited) unvisited.add(candidate);
    updatePosition(candidate, distance + candidate.value);
  }
};

const start = async () => {
  const content = fs.readFileSync(path.join(__dirname, file), 'utf8');

  const grid = parseInputPart2(content);
  grid.Values[0][0].distance = 0;

  // Set of unvisited positions, just start with start position.
  const unvisited = new Set<Space>([grid.Values[0][0]]);

  let iterations = 0;
  while (true) {
    iterations++;
    //if (iterations % 10000 == 0) console.log(unvisited.size);

    const candidate = [...unvisited.values()]
      .sort((a, b) => a.distance - b.distance)
      .shift();

    // No grid spaces left to check if there isn't one remaining or "closest" is still at Infinity (unreachable). Need
    // to check this also to account for blocked off areas.
    if (!candidate || candidate.distance === Infinity) {
      console.log(`Breaking early on candidate ${candidate}`);
      break;
    }

    // Update neighbours
    updateNeighbours(grid, candidate, unvisited);

    // Mark candidate as visited
    candidate.visited = true;
    unvisited.delete(candidate);

    if (candidate.x == grid.Width - 1 && candidate.y == grid.Height - 1) {
      // Reached end
      console.log(candidate);
      break;
    }
  }
};

start();
