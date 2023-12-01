import toSum from '@utils/toSum';
import fs from 'fs';
import path from 'path';
import { parseInput } from './utils';

const debugMode = true;
const debug = (...params: any[]) => debugMode && console.log(...params);
const log = (...params: any[]) => console.log(...params);

const words = [
  'one',
  'two',
  'three',
  'four',
  'five',
  'six',
  'seven',
  'eight',
  'nine',
];

// Part 1
//const regex = new RegExp(/(?=(\d))/g);

// Part 2
const pattern = `(?=(\\d|${words.join('|')}))`;
const regex = new RegExp(pattern, 'g');

const asValue = (input: string) => {
  // Is it already a digit
  const value = parseInt(input);
  if (value) return value;

  // Otherwise must be a word
  return words.indexOf(input) + 1;
};

const convertToDigits = (line: string) => {
  // Find all matches
  const matches = [...line.matchAll(regex)];

  const firstDigit = asValue(matches[0][1]);
  const lastDigit = asValue(matches[matches.length - 1][1]);

  const value = firstDigit * 10 + lastDigit;

  debug(`${line} => ${value}`);

  return value;
};

const start = async (file: string) => {
  const content = fs.readFileSync(path.join(__dirname, file), 'utf8');
  const lines = parseInput(content);

  const value = lines.map((l) => convertToDigits(l)).reduce(toSum);

  log(value);
};

//start('./files/example.txt');
//start('./files/example2.txt');
start('./files/input.txt');
//start('./files/test.txt');
