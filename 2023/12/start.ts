import fs from 'fs';
import path from 'path';
import { countPatternIndexCombinations, parseInput } from './utils';

const debugMode = false;
const debug = (...params: any[]) => debugMode && console.log(...params);
const log = (...params: any[]) => console.log(...params);

const start = async (file: string) => {
  const content = fs.readFileSync(path.join(__dirname, file), 'utf8');

  const rows = parseInput(content, true);

  let total = 0;

  for (const row of rows) {
    log(`Pattern: ${row.pattern} Groups: ${row.groups}`);

    const indexCombinations = countPatternIndexCombinations(row);

    log(`Combos: ${indexCombinations}`);
    total += indexCombinations;
  }

  log(`Total: ${total}`);
};

//start('./files/example.txt');
start('./files/input.txt');
//start('./files/test.hard2.txt');
