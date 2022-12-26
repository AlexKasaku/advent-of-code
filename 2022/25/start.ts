import toSum from '@utils/toSum';
import fs from 'fs';
import path from 'path';
import { intToSnafu, parseInput, snafuToInt } from './utils';

//const file = './files/example.txt';
const file = './files/input.txt';

const start = async () => {
  const content = fs.readFileSync(path.join(__dirname, file), 'utf8');

  const snafus = parseInput(content);

  const total = snafus.map((s) => snafuToInt(s)).reduce(toSum);

  console.log(intToSnafu(total));
};

start();
