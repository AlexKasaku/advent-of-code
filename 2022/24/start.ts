import range from '@utils/range';
import fs from 'fs';
import path from 'path';
import { buildAllGridStates } from './utils';
import { parseInput } from './utils.parse';

//const file = './files/example.txt';
const file = './files/example.2.txt';
//const file = './files/input.txt';
//const file = './files/test.txt';

const start = async () => {
  const content = fs.readFileSync(path.join(__dirname, file), 'utf8');

  const setup = parseInput(content);

  console.log(setup.width);
  console.log(setup.height);

  const uniqueStates = (setup.width - 2) * (setup.height - 2);
  console.log(uniqueStates);

  // Blizzard states loop, so precalculate all states!
  const gridStates = buildAllGridStates(setup, uniqueStates);

  // Now, let's solve it (eep).
};

start();
