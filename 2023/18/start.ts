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

const calculateWithGrid = (steps: Step[]): void => {
  const points = getPointsFromSteps(steps);
  const [topLeft, bottomRight] = calculateBounds(points);

  const grid = buildGrid(topLeft, bottomRight);

  const startingPosition = { x: Math.abs(topLeft.x), y: Math.abs(topLeft.y) };

  digGrid(grid, startingPosition, steps);
  fillFromCenter(grid);

  renderGrid(grid);

  const dugPoints = grid.Values.flat()
    .map((s) => (s.dug ? 1 : 0))
    .reduce(toSum, 0);

  log(`Total: ${dugPoints}`);
};

const fastCalculate = (steps: Step[]): void => {
  const points = getPointsFromSteps(steps);

  debug(points);

  // Calculate area within polygon.
  // Reference: https://www.mathopenref.com/coordpolygonarea.html
  // Reference: https://www.mathopenref.com/coordpolygonarea2.html
  // This works because the area is simple with no intersections
  let area = 0;
  for (let index = 0; index < points.length; index++) {
    const product1 = points[index].x * points[(index + 1) % points.length].y;
    const product2 = points[index].y * points[(index + 1) % points.length].x;

    area += product1 - product2;
  }
  area = Math.abs(area) / 2;

  debug(`Area: ${area}`);

  // Add on 1/2 the perimeter. The way we've got the points means we need to account for an additional
  // layer in the X + Y axis. This could perhaps be just accounted for by amending the points?
  let perimeter = 0;
  for (let index = 0; index < points.length - 1; index++) {
    const a = points[index];
    const b = points[index + 1];
    perimeter += Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
  }
  const perimeterArea = perimeter / 2 + 1;

  debug(`Perimeter: ${perimeterArea}`);
  log(`Total: ${area + perimeterArea}`);
};

const start = async (file: string) => {
  const content = fs.readFileSync(path.join(__dirname, file), 'utf8');

  // Part1 = true Part2 = false
  const steps = parseInput(content, false);

  // Method used for part 1. Very slow but allows for rendering.
  //calculateWithGrid(steps);

  // Method used for part 2 (and works for part 1). Just calculates the area quickly, works
  // for extremely large polygons.
  fastCalculate(steps);
};

start('./files/example.txt');
//start('./files/input.txt');
