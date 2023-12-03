import fs from 'fs';
import path from 'path';
import { EngineSpace } from './types';
import { parseInput } from './utils';

const debugMode = false;
const debug = (...params: any[]) => debugMode && console.log(...params);
const log = (...params: any[]) => console.log(...params);

const isSymbol = (s: EngineSpace) => s.symbol !== undefined;

const start = async (file: string) => {
  const content = fs.readFileSync(path.join(__dirname, file), 'utf8');

  const engine = parseInput(content);

  // Mark all adjacent spaces to symbols
  engine.Values.flat()
    .filter(isSymbol)
    .forEach((symbol) => {
      engine.getNeighbours(symbol, false).forEach((s) => {
        s.adjacent = true;
      });
    });

  // Work through grid, find numbers that aren't adjacent
  let partNumbersTotal = 0;

  for (let y = 0; y < engine.Height; y++) {
    let currentNumber = '';
    let isAdjacent = false;

    for (let x = 0; x < engine.Width; x++) {
      const space = engine.Values[y][x];

      if (space.value !== undefined) {
        currentNumber += space.value.toString();
        if (space.adjacent) isAdjacent = true;
      } else {
        if (currentNumber != '' && isAdjacent) {
          // Finished a number and no digit was adjacent
          log(`Found part: ${currentNumber}`);
          partNumbersTotal += parseInt(currentNumber);
        }
        currentNumber = '';

        isAdjacent = false;
      }
    }

    // Check numbers at end of row too
    if (currentNumber != '' && isAdjacent) {
      // Finished a number and no digit was adjacent
      log(`Found part: ${currentNumber}`);
      partNumbersTotal += parseInt(currentNumber);
    }
  }

  log(`Total: ${partNumbersTotal}`);

  //console.dir(engine, { depth: null });
};

//start('./files/example.txt');
start('./files/input.txt');
//start('./files/test.txt');

// Last test: 443169
