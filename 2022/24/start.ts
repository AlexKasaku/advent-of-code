import fs from 'fs';
import path from 'path';
import { buildGridFromState, parseInput, renderGrid } from './utils';

//const file = './files/example.txt';
//const file = './files/example.2.txt';
const file = './files/input.txt';

const start = async () => {
  const content = fs.readFileSync(path.join(__dirname, file), 'utf8');

  const setup = parseInput(content);

  console.log(setup);

  const grid = buildGridFromState(
    setup.width,
    setup.height,
    setup.start,
    setup.end,
    setup.blizzards
  );

  renderGrid(grid);
};

start();
