import fs from 'fs';
import path from 'path';
import { parseInput } from './utils';

const debugMode = false;
const debug = (...params: any[]) => debugMode && console.log(...params);
const log = (...params: any[]) => console.log(...params);

const start = async (file: string) => {
  const content = fs.readFileSync(path.join(__dirname, file), 'utf8');

  const histories: number[][] = parseInput(content);

  let futureTotal = 0,
    pastTotal = 0;

  for (const history of histories) {
    const differences = [history];

    // Repeat until we have a differences entry that is all zeroes
    while (differences[differences.length - 1].some((n) => n != 0)) {
      const lastLevel = differences[differences.length - 1];
      const nextLevel = lastLevel.reduce((a, b, i) => {
        if (i > 0) {
          //const diff = Math.abs(b - lastLevel[i - 1]);
          const diff = b - lastLevel[i - 1];
          a.push(diff);
        }
        return a;
      }, [] as number[]);
      differences.push(nextLevel);
    }

    debug(differences);

    // Now work up and find previous + next value
    let lastNextValue = 0,
      lastPreviousValue = 0;
    for (let index = differences.length - 2; index >= 0; index--) {
      const thisLevel = differences[index];

      thisLevel.push(thisLevel[thisLevel.length - 1] + lastNextValue);
      thisLevel.unshift(thisLevel[0] - lastPreviousValue);

      lastPreviousValue = thisLevel[0];
      lastNextValue = thisLevel[thisLevel.length - 1];
    }

    futureTotal += lastNextValue;
    pastTotal += lastPreviousValue;

    debug(differences);
    debug();
  }

  log(`Past total: ${pastTotal}`);
  log(`Future total: ${futureTotal}`);
};

//start('./files/example.txt');
//start('./files/test.txt');
start('./files/input.txt');
