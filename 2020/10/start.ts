import fs from 'fs';
import path from 'path';
import { parseInput } from './utils';
import { byAscending } from '@utils/sort';

const debugMode = true;
const debug = (...params: any[]) => debugMode && console.log(...params);
const log = (...params: any[]) => console.log(...params);

const start = async (file: string) => {
  const content = fs.readFileSync(path.join(__dirname, file), 'utf8');

  const adapters = parseInput(content).sort(byAscending);
  const deviceRating = adapters[adapters.length - 1] + 3;

  debug(adapters);
  debug(`Device rating: ${deviceRating}`);

  // Part 1
  let lastRating = 0;
  let joltOneJump = 0,
    joltThreeJump = 0;
  for (const adapter of [...adapters, deviceRating]) {
    const jump = adapter - lastRating;
    if (jump === 1) joltOneJump++;
    else if (jump === 3) joltThreeJump++;
    lastRating = adapter;
  }

  log(`${joltOneJump} * ${joltThreeJump} = ${joltOneJump * joltThreeJump}`);
};

start('./files/example.txt');
start('./files/example2.txt');
start('./files/input.txt');
