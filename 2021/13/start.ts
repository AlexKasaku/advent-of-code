import toSum from '@utils/toSum';
import fs from 'fs';
import { EOL } from 'os';
import path from 'path';
import {
  foldOn,
  parseFolds,
  parsePoints,
  renderGrid,
  visibleDots,
} from './utils';

//const file = './files/example.txt';
const file = './files/input.txt';

const start = async () => {
  const content = fs
    .readFileSync(path.join(__dirname, file), 'utf8')
    .split(EOL + EOL);

  let grid = parsePoints(content[0]);
  const folds = parseFolds(content[1]);

  for (const fold of folds) {
    grid = foldOn(grid, fold.axis == 'x', fold.point);
    console.log(visibleDots(grid));
  }

  renderGrid(grid);
};

start();
