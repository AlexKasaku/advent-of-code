import fs from 'fs';
import path from 'path';
import {
  buildGrid,
  caclculateBounds as calculateBounds,
  digGrid,
  fillFromCenter,
  getPointsFromSteps,
  parseInput,
  renderGrid,
} from './utils';
import toSum from '@utils/toSum';
import { Position } from '@utils/grid';
import { Step } from './types';

const debugMode = false;
const debug = (...params: any[]) => debugMode && console.log(...params);
const log = (...params: any[]) => console.log(...params);

const part1 = (steps: Step[]): void => {
  // Part 1, still using a grid:
  const points = getPointsFromSteps(steps);
  const [topLeft, bottomRight] = calculateBounds(points);

  const grid = buildGrid(topLeft, bottomRight);

  const startingPosition = { x: Math.abs(topLeft.x), y: Math.abs(topLeft.y) };

  digGrid(grid, startingPosition, steps);
  //renderGrid(grid);
  fillFromCenter(grid);
  //renderGrid(grid);

  const dugPoints = grid.Values.flat()
    .map((s) => (s.dug ? 1 : 0))
    .reduce(toSum, 0);
  log(dugPoints);
};

const part2 = (steps: Step[]): void => {
  const points = getPointsFromSteps(steps);

  log(points);

  // Calculate area within polygon
  let area = 0;
  for (let index = 0; index < points.length; index++) {
    const product1 = points[index].x * points[(index + 1) % points.length].y;
    const product2 = points[index].y * points[(index + 1) % points.length].x;

    area += product1 - product2;
  }
  area = Math.abs(area) / 2;

  log(`Area: ${area}`);

  // Add on perimeter
  let perimeter = 0;
  for (let index = 0; index < points.length - 1; index++) {
    const a = points[index];
    const b = points[index + 1];
    perimeter += Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
  }
  const perimeterArea = perimeter / 2 + 1;

  log(`Perimeter: ${perimeterArea}`);
  log(`Total: ${area + perimeterArea}`);
};

const start = async (file: string) => {
  const content = fs.readFileSync(path.join(__dirname, file), 'utf8');

  const steps = parseInput(content, false);
  part2(steps);
};

start('./files/example.txt');
//start('./files/input.txt');
