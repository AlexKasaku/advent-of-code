import fs from 'fs';
import path from 'path';
import { EngineSpace } from './types';
import { parseInput } from './utils';

const debugMode = false;
const debug = (...params: any[]) => debugMode && console.log(...params);
const log = (...params: any[]) => console.log(...params);

const isSymbol = (s: EngineSpace) => s.symbol !== undefined;
const isGear = (s: EngineSpace) => s.symbol == '*';

const start = async (file: string) => {
  const content = fs.readFileSync(path.join(__dirname, file), 'utf8');

  const engine = parseInput(content);

  // Mark all adjacent spaces to symbols
  engine.Values.flat()
    .filter(isSymbol)
    .forEach((symbol) => {
      const isGear = symbol.symbol == '*';

      engine.getNeighbours(symbol, false).forEach((s) => {
        s.adjacentToSymbol = true;

        if (isGear) s.adjacentGears.push(symbol);
      });
    });

  let partNumbersTotal = 0;

  for (let y = 0; y < engine.Height; y++) {
    let currentNumber = '';
    let isAdjacent = false;
    let adjacentGears: Set<EngineSpace> = new Set<EngineSpace>();

    const processCurrentNumber = () => {
      // Can reference above thanks to closure
      const number = parseInt(currentNumber);

      if (isAdjacent) {
        // Finished a number and no digit was adjacent
        debug(`Found part: ${number}`);
        partNumbersTotal += number;
      }

      for (const gear of adjacentGears)
        gear.adjacentNumbersToThisGear.push(number);
    };

    for (let x = 0; x < engine.Width; x++) {
      const space = engine.Values[y][x];

      if (space.value !== undefined) {
        currentNumber += space.value.toString();
        if (space.adjacentToSymbol) isAdjacent = true;
        for (const gear of space.adjacentGears) adjacentGears.add(gear);
      } else {
        if (currentNumber != '') {
          // Finished a number
          processCurrentNumber();
        }
        currentNumber = '';

        isAdjacent = false;
        adjacentGears = new Set<EngineSpace>();
      }
    }

    // Check numbers at end of row too
    if (currentNumber != '') {
      // Finished a number
      processCurrentNumber();
    }
  }

  log(`Total: ${partNumbersTotal}`);

  let gearRatiosTotal = 0;

  // Find gears with two adjacent numbers
  engine.Values.flat()
    .filter(isGear)
    .forEach((gear) => {
      if (gear.adjacentNumbersToThisGear.length == 2) {
        gearRatiosTotal +=
          gear.adjacentNumbersToThisGear[0] * gear.adjacentNumbersToThisGear[1];
      }
    });

  log(`Gear Ratio Total: ${gearRatiosTotal}`);
};

//start('./files/example.txt');
start('./files/input.txt');
//start('./files/test.txt');
