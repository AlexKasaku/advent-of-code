import fs from 'fs';
import path from 'path';
import { createGridFromPoints, parsePoints, renderGrid } from './utils';

const file = './files/example.txt';
//const file = './files/input.txt';

const start = async () => {
  const content = fs.readFileSync(path.join(__dirname, file), 'utf8');

  const points = parsePoints(content);

  //console.log(points);

  const grid = createGridFromPoints(points);

  renderGrid(grid);
};

start();
