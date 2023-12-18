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

const debugMode = false;
const debug = (...params: any[]) => debugMode && console.log(...params);
const log = (...params: any[]) => console.log(...params);

const start = async (file: string) => {
  const content = fs.readFileSync(path.join(__dirname, file), 'utf8');

  const steps = parseInput(content);

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

//start('./files/example.txt');
start('./files/input.txt');
