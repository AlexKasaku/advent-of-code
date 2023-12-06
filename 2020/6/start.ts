import fs from 'fs';
import path from 'path';
import { parseInput } from './utils';

const debugMode = true;
const debug = (...params: any[]) => debugMode && console.log(...params);
const log = (...params: any[]) => console.log(...params);

const start = async (file: string) => {
  const content = fs.readFileSync(path.join(__dirname, file), 'utf8');

  const answerGroups = parseInput(content);

  let total = 0;

  for (const group of answerGroups) {
    const answerSet = new Set<string>();
    for (const answer of group) for (const char of answer) answerSet.add(char);

    debug('Set size: ' + answerSet.size);
    total += answerSet.size;
  }

  log('Total: ' + total);
};

//start('./files/example.txt');
start('./files/input.txt');
