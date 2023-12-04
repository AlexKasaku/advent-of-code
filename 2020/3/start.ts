import fs from 'fs';
import path from 'path';
import { parseInput } from './utils';
import { Grid } from '@utils/grid';
import { Space } from './types';

const debugMode = false;
const debug = (...params: any[]) => debugMode && console.log(...params);
const log = (...params: any[]) => console.log(...params);

const renderGrid = (grid: Grid<Space>): void => {
  for (const row of grid.Values)
    console.log(row.reduce((a, b) => a + b.char, ''));
  console.log();
};

type SlopeCheck = { right: number; down: number };
const slopeChecksPart1 = [{ right: 3, down: 1 }];
const slopeChecksPart2 = [
  ...slopeChecksPart1,
  { right: 1, down: 1 },
  { right: 5, down: 1 },
  { right: 7, down: 1 },
  { right: 1, down: 2 },
];

const run = (grid: Grid<Space>, slopeChecks: SlopeCheck[]) => {
  let runningTreeCount = 1;
  for (const { right, down } of slopeChecks) {
    let curX = 0,
      curY = 0,
      trees = 0;

    while (curY < grid.Height) {
      if (grid.get({ x: curX, y: curY })!.char === '#') trees++;
      curX = (curX + right) % grid.Width;
      curY += down;
    }

    log('Trees found: ' + trees);
    runningTreeCount *= trees;
  }
  log('Total trees found: ' + runningTreeCount);
};

const start = async (file: string) => {
  const content = fs.readFileSync(path.join(__dirname, file), 'utf8');

  const grid = parseInput(content);

  log(`Grid Height ${grid.Height}, Width ${grid.Width}`);
  renderGrid(grid);

  run(grid, slopeChecksPart1);
  run(grid, slopeChecksPart2);
};

start('./files/example.txt');
//start('./files/input.txt');
