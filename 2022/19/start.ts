import fs from 'fs';
import path from 'path';
import { parseInput } from './utils';

//const file = './files/example.txt';
const file = './files/input.txt';

const start = async () => {
  const content = fs.readFileSync(path.join(__dirname, file), 'utf8');

  const blueprints = parseInput(content);

  console.log(blueprints);
};

start();
