import fs from 'fs';
import path from 'path';
import { parseInput, processString } from './utils';
import toSum from '@utils/toSum';

const debugMode = true;
const debug = (...params: any[]) => debugMode && console.log(...params);
const log = (...params: any[]) => console.log(...params);

const start = async (file: string) => {
  const content = fs.readFileSync(path.join(__dirname, file), 'utf8');

  const expressions = parseInput(content);

  const total = expressions.map((e) => processString(e)).reduce(toSum);
  log(total);
};

//start('./files/example.txt');
start('./files/input.txt');
