import fs from 'fs';
import path from 'path';
import { parseInput, addHandTypes, compareHands } from './utils';
import toSum from '@utils/toSum';

const debugMode = false;
const debug = (...params: any[]) => debugMode && console.log(...params);
const log = (...params: any[]) => console.log(...params);

const start = async (file: string) => {
  const content = fs.readFileSync(path.join(__dirname, file), 'utf8');

  const hands = parseInput(content);
  // Determine hand type first as we only need to do this once
  const processedHands = addHandTypes(hands);

  // Part 1

  // Sort hands
  processedHands.sort(compareHands).reverse();

  const rankTotal = processedHands
    .map((hand, index) => (index + 1) * hand.bid)
    .reduce(toSum);

  log(processedHands);
  log(rankTotal);
};

//start('./files/example.txt');
start('./files/input.txt');
