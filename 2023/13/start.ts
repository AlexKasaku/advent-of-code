import fs from 'fs';
import path from 'path';
import { findReflectionRowIndex, parseInput } from './utils';
import transpose from '@utils/transpose';

const debugMode = false;
const debug = (...params: any[]) => debugMode && console.log(...params);
const log = (...params: any[]) => console.log(...params);

const start = async (file: string) => {
  const content = fs.readFileSync(path.join(__dirname, file), 'utf8');

  const patterns = parseInput(content);

  let p = 0;
  let total = 0;

  for (const pattern of patterns) {
    debug(`---- Pattern ${p} ---- `);

    let index = findReflectionRowIndex(pattern.Values);
    if (index > -1) {
      // Reflection is horizontal
      total += 100 * (index + 1);
    } else {
      // Reflection is vertical
      index = findReflectionRowIndex(transpose(pattern.Values));
      total += index + 1;
    }
    p++;
  }
  log(total);
};

//start('./files/example.txt');
start('./files/input.txt');
