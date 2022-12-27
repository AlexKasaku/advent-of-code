import { Grid } from '@utils/grid';
import fs from 'fs';
import path from 'path';
import { Space } from './types';
import { parseInput } from './utils';

//const file = './files/example.txt';
const file = './files/input.txt';

const updatePosition = (position: Space, distance: number): void => {
  if (position.visited) return;

  if (distance < position.distance) position.distance = distance;
};

const updateNeighbours = (
  grid: Grid<Space>,
  { x, y, distance, value }: Space
): void => {
  // Find each position that is reachable and unvisited
  if (x > 0) {
    const candidate = grid.Values[y][x - 1]!;

    updatePosition(candidate, distance + candidate.value);
  }
  if (x < grid.Values[y].length - 1) {
    const candidate = grid.Values[y][x + 1]!;

    updatePosition(candidate, distance + candidate.value);
  }
  if (y > 0) {
    const candidate = grid.Values[y - 1][x]!;

    updatePosition(candidate, distance + candidate.value);
  }
  if (y < grid.Values.length - 1) {
    const candidate = grid.Values[y + 1][x]!;

    updatePosition(candidate, distance + candidate.value);
  }
};

const start = async () => {
  const content = fs.readFileSync(path.join(__dirname, file), 'utf8');

  const grid = parseInput(content);
  grid.Values[0][0].distance = 0;

  let iterations = 0;
  while (true) {
    iterations++;

    const candidate = grid.Values.flat()
      .filter((x) => !x.visited)
      .sort((a, b) => a.distance - b.distance)
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

    //     // If current total > smallestCost, don't bother continuing.
    //     if (state.total >= smallestCost) continue;

    if (candidate.x == grid.Width - 1 && candidate.y == grid.Height - 1) {
      // Reached end
      console.log(candidate);
      break;
    }

    // ;
  }
};

start();
