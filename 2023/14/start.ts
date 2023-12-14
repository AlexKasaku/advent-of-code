import fs from 'fs';
import path from 'path';
import { parseInput, renderGrid, tiltGrid } from './utils';
import toSum from '@utils/toSum';

const debugMode = false;
const debug = (...params: any[]) => debugMode && console.log(...params);
const log = (...params: any[]) => console.log(...params);

const start = async (file: string) => {
  const content = fs.readFileSync(path.join(__dirname, file), 'utf8');

  const grid = parseInput(content);

  if (debugMode) renderGrid(grid);
  tiltGrid(grid);
  if (debugMode) renderGrid(grid);

  const totalLoad = grid.Values.flat()
    .filter((r) => r.isRock && !r.isStaticRock)
    .map((r) => grid.Height - r.y)
    .reduce(toSum);

  log(totalLoad);
};

//start('./files/example.txt');
start('./files/input.txt');
