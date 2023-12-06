import fs from 'fs';
import path from 'path';
import { parseInput } from './utils';

const debugMode = false;
const debug = (...params: any[]) => debugMode && console.log(...params);
const log = (...params: any[]) => console.log(...params);

const start = async (file: string) => {
  const content = fs.readFileSync(path.join(__dirname, file), 'utf8');

  const answerGroups = parseInput(content);

  let totalForAny = 0;
  let totalForAll = 0;

  for (const group of answerGroups) {
    const answerMap = new Map<string, number>();
    for (const answer of group)
      for (const char of answer) {
        answerMap.set(char, (answerMap.get(char) ?? 0) + 1);
      }

    debug('Set size: ' + answerMap.size);

    totalForAny += answerMap.size;
    totalForAll += [...answerMap.values()].filter(
      (x) => x == group.length,
    ).length;
  }

  log('Total For Any: ' + totalForAny);
  log('Total For All: ' + totalForAll);
};

//start('./files/example.txt');
start('./files/input.txt');
