import fs from 'fs';
import path from 'path';
import { parseInput } from './utils';
import { byAscending, byDescending } from '@utils/sort';

const debugMode = true;
const debug = (...params: any[]) => debugMode && console.log(...params);
const log = (...params: any[]) => console.log(...params);

const start = async (file: string) => {
  const content = fs.readFileSync(path.join(__dirname, file), 'utf8');

  const adapters = parseInput(content).sort(byAscending);
  const deviceRating = adapters[adapters.length - 1] + 3;

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

  log(
    `Part 1: ${joltOneJump} * ${joltThreeJump} = ${
      joltOneJump * joltThreeJump
    }`,
  );

  // Part 2
  // This will map how many ways there are to connect a number to the device, we'll build it up.
  adapters.sort(byDescending);

  const routesToEnd = new Map<number, number>();
  routesToEnd.set(deviceRating, 1);

  for (const adapter of [...adapters, 0]) {
    // Get all jumps from this adapter to the next size up.
    const jumps =
      (routesToEnd.get(adapter + 1) ?? 0) +
      (routesToEnd.get(adapter + 2) ?? 0) +
      (routesToEnd.get(adapter + 3) ?? 0);

    routesToEnd.set(adapter, jumps);
  }

  log(`Part 2: Combinations: ${routesToEnd.get(0)!}`);
  log();
};

start('./files/example.txt');
start('./files/example2.txt');
start('./files/input.txt');
