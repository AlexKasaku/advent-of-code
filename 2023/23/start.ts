import fs from 'fs';
import path from 'path';
import { parseInput, renderGrid } from './utils';
import { Grid, Position } from '@utils/grid';
import priorityQueue from '@utils/priorityQueue';
import { Space } from './types';

const debugMode = false;
const debug = (...params: any[]) => debugMode && console.log(...params);
const log = (...params: any[]) => console.log(...params);

type Route = {
  position: Position;
  visited: Set<Position>;
};

// const getStateKey = ({ x, y }: Position): string => `${x},${y}`;

const isUphill = (position: Position, newPosition: Space) => {
  if (newPosition.y < position.y && newPosition.char === 'v') return true;
  if (newPosition.x < position.x && newPosition.char === '>') return true;
  return false;
};

// Run another search to determine if we can still reach the end from this position at all, regardless of length
// Is this really inefficient doing this every time?
const endStillReachable = (
  grid: Grid<Space>,
  end: Space,
  route: Route,
): boolean => {
  const queue = priorityQueue<Route>((a, b) => a.visited.size < b.visited.size);
  queue.insert(route);
  const testedSpaces = new Set<Position>();

  //log(`Testing can reach end from ${route.position.x},${route.position.y}`);

  while (!queue.isEmpty()) {
    const { position, visited } = queue.dequeue()!;

    // We can reach the end, yay!
    if (position === end) {
      return true;
    }

    // Skip this attempt if we've been here before
    const previousVisit = testedSpaces.has(position);
    if (previousVisit !== false) continue;

    // We haven't tried here yet
    testedSpaces.add(position);

    // Find all neighbours that: aren't walls and haven't yet visited
    const neighbours = grid
      .getNeighbours(position, true)
      .filter((s) => !s.isWall && !visited.has(s));

    neighbours.forEach((n) => {
      queue.insert({
        position: n,
        visited: new Set<Position>([...visited, position]),
      });
    });
  }

  // Exhaused all possibilities, can't reach end.
  return false;
};

const start = async (file: string) => {
  const content = fs.readFileSync(path.join(__dirname, file), 'utf8');
  const grid = parseInput(content);

  const start = grid.Values[0].find((s) => !s.isWall)!;
  const end = grid.Values[grid.Values.length - 1].find((s) => !s.isWall)!;

  const highestDistanceForPosition = new Map<Position, number>();

  const ignoreHills = false;

  // Prioritise queue by which has the greatest distance travelled
  const queue = priorityQueue<Route>((a, b) => a.visited.size > b.visited.size);
  queue.insert({
    position: start,
    visited: new Set<Position>(),
  });

  let iterations = 0;
  while (!queue.isEmpty()) {
    const { position, visited } = queue.dequeue()!;

    //if (iterations % 100000 === 0) console.log(queue.size());

    if (position === end) {
      // Reached end. What's our score?
      visited.add(end);
      //renderGrid(grid, visited);
      log(`Total spaces visited: ${visited.size - 1}`);
    } else {
      // Have we been to this space before, and was it with a higher distance?
      const previousVisit = highestDistanceForPosition.get(position);
      if (previousVisit !== undefined && previousVisit >= visited.size)
        continue;

      //This is new or better visit for this space
      highestDistanceForPosition.set(position, visited.size);

      // Find all neighbours that: aren't walls, we haven't yet visited, aren't uphill
      // TODO: Ignoring uphill just now
      const neighbours = grid
        .getNeighbours(position, true)
        .filter(
          (s) =>
            !s.isWall &&
            !visited.has(s) &&
            (ignoreHills || !isUphill(position, s)),
        );

      neighbours.forEach((n) => {
        // Only add this neighbour if the end is still reachable. We run this here rather than in the
        // above filter, as here we will only run it if there is more than one possible exit, to avoid
        // running it on every straight path where we have no choice anyway.
        const route: Route = {
          position: n,
          visited: new Set<Position>([...visited, position]),
        };

        if (
          neighbours.length == 1 ||
          ignoreHills ||
          endStillReachable(grid, end, route)
        ) {
          queue.insert(route);
        }
      });
    }
    iterations++;
  }
};

//start('./files/example.txt');
start('./files/input.txt');
