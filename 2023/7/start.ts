import fs from 'fs';
import path from 'path';
import { parseInput, addHandTypes, createHandComparer } from './utils';
import toSum from '@utils/toSum';

const debugMode = false;
const debug = (...params: any[]) => debugMode && console.log(...params);
const log = (...params: any[]) => console.log(...params);

const start = async (file: string) => {
  const content = fs.readFileSync(path.join(__dirname, file), 'utf8');

  const hands = parseInput(content);

  // Part 2, for Part 1 use false.
  const jackIsWild = true;

  // Determine hand type first as we only need to do this once
  const processedHands = addHandTypes(hands, jackIsWild);

  // Sort hands
  processedHands.sort(createHandComparer(jackIsWild)).reverse();

  debug('Lowest hand');
  debug(processedHands[0]);

  debug('Highest hand');
  debug(processedHands[processedHands.length - 1]);

  const rankTotal = processedHands
    .map((hand, index) => (index + 1) * hand.bid)
    .reduce(toSum);

  log(rankTotal);
};

//start('./files/example.txt');
start('./files/input.txt');
