import intersect from '@utils/intersect';
import fs from 'fs';
import path from 'path';
import { Round } from './types';
import { parseInput } from './utils';

const debugMode = false;
const debug = (...params: any[]) => debugMode && console.log(...params);
const log = (...params: any[]) => console.log(...params);

const part1 = (rounds: Round[]) => {
  let total = 0;
  for (const round of rounds) {
    const intersection = intersect(round.winningNumbers, round.numbers);
    const matches = intersection.length;
    const value = matches > 0 ? Math.pow(2, matches - 1) : 0;

    debug(`Card ${round.id} value: ${value}`);

    total += value;
  }
  log(`Part 1 Total: ${total}`);
};

const start = async (file: string) => {
  const content = fs.readFileSync(path.join(__dirname, file), 'utf8');

  const rounds = parseInput(content);

  part1(rounds);

  //console.dir(rounds, { depth: null });
};

//start('./files/example.txt');
start('./files/input.txt');
