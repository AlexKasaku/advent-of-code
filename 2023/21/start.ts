import fs from 'fs';
import path from 'path';
import { parseInput, parseInputPart2 } from './utils';
import { Position } from '@utils/grid';
import { Space } from './types';
import { lagrangeInterpolate } from '@utils/lagrange';

const debugMode = true;
const debug = (...params: any[]) => debugMode && console.log(...params);
const log = (...params: any[]) => console.log(...params);

type State = { pos: Position; step: number };

const start = async (file: string) => {
  const content = fs.readFileSync(path.join(__dirname, file), 'utf8');

  // We will caculate the polynomial coefficients, for that we need
  // the first 3 terms which are based on steps of 1.5x the repeats value,
  // so that the steps go right to the edge.

  // Note that this only works with the real input and not the example!
  const n0 = outputReachableSteps(content, 1); // n0 is answer for part 1
  const n1 = outputReachableSteps(content, 2);
  const n2 = outputReachableSteps(content, 3);

  const target = 202300; // Taken from steps (26501365 - 65) / 131;

  const value = lagrangeInterpolate([n0, n1, n2], target);
  log(value);
};

const outputReachableSteps = (content: string, repeats: number): number => {
  // Create a repeating grid big enough for what we need.
  const grid = parseInputPart2(content, 7);

  const middle = (grid.Width - 1) / 2;
  const startPosition = { x: middle, y: middle };

  const totalSteps = 131 * (repeats - 1) + 65;
  const states = [{ pos: startPosition, step: 0 }];
  const toVisit = new Set<Space>();

  while (states.length > 0) {
    const state = states.shift()!;

    // Mark this position as visited
    const space = grid.get(state.pos)!;
    space.visited = true;
    space.visitedOnStep = state.step;

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
  }

  return grid.Values.flat().filter(
    (f) => f.visited && f.visitedOnStep! % 2 === totalSteps % 2,
  ).length;
};

//start('./files/example.txt');
start('./files/input.txt');
