import fs from 'fs';
import path from 'path';
import { parseInput, renderGrid } from './utils';
import { Position, manhattanDistance } from '@utils/grid';
import { Space } from './types';

const debugMode = true;
const debug = (...params: any[]) => debugMode && console.log(...params);
const log = (...params: any[]) => console.log(...params);

type State = { pos: Position; step: number };

const start = async (file: string) => {
  const content = fs.readFileSync(path.join(__dirname, file), 'utf8');

  const [grid, startPosition] = parseInput(content);

  const totalSteps = 64;
  const states = [{ pos: startPosition, step: 0 }];
  const toVisit = new Set<Space>();

  let cycles = 0;
  while (states.length > 0) {
    if (cycles % 10000 == 0) log(states.length);

    const state = states.shift()!;

    // Mark this position as visited
    const space = grid.get(state.pos)!;
    space.visited = true;
    space.visitedOnStep = state.step;
    //debug(space);

    if (state.step == totalSteps) continue;

    // Get neighbours that haven't been visited yet
    const unvisitedNeighbours = grid
      .getNeighbours(state?.pos, true)
      .filter((s) => !s.isRock && !s.visited && !toVisit.has(s));

    // Add neighbours to stack
    unvisitedNeighbours.forEach((n) => {
      toVisit.add(n);
      states.push({ pos: { x: n.x, y: n.y }, step: state.step + 1 });
    });

    cycles++;
  }

  renderGrid(grid, true);

  const reachableSteps = grid.Values.flat().filter(
    (f) => f.visited && f.visitedOnStep! % 2 == 0,
  ).length;

  log(`Reachable steps: ${reachableSteps}`);
};

//start('./files/example.txt');
start('./files/input.txt');
