import fs from 'fs';
import path from 'path';
import { findReflectionRowIndex, parseInput, renderGrid } from './utils';
import transpose from '@utils/transpose';
import { Grid } from '@utils/grid';
import { Space } from './types';

const debugMode = false;
const debug = (...params: any[]) => debugMode && console.log(...params);
const log = (...params: any[]) => console.log(...params);

const part1 = (patterns: Grid<Space>[]) => {
  let total = 0;
  for (const pattern of patterns) {
    let index = findReflectionRowIndex(pattern.Values);
    if (index > -1) {
      // Reflection is horizontal
      total += 100 * (index + 1);
    } else {
      // Reflection is vertical
      index = findReflectionRowIndex(transpose(pattern.Values));
      total += index + 1;
    }
  }
  log(total);
};

const part2 = (patterns: Grid<Space>[]) => {
  let total = 0;
  let p = 0;
  for (const pattern of patterns) {
    debug(`--------- Pattern ${p} ---------`);

    let originalMatch: { horizontal: boolean; index: number };

    // Find initial index value;
    let index = findReflectionRowIndex(pattern.Values);
    if (index > -1) {
      // Reflection is horizontal
      originalMatch = { horizontal: true, index };
    } else {
      // Reflection is vertical
      index = findReflectionRowIndex(transpose(pattern.Values));
      originalMatch = { horizontal: false, index };
    }

    for (const valueToToggle of pattern.Values.flat()) {
      // Flip the current space
      valueToToggle.isRock = !valueToToggle.isRock;

      let index = findReflectionRowIndex(
        pattern.Values,
        originalMatch.horizontal ? originalMatch.index : undefined,
      );
      if (index > -1) {
        // Reflection is horizontal
        total += 100 * (index + 1);
        break;
      } else {
        // Reflection is vertical
        index = findReflectionRowIndex(
          transpose(pattern.Values),
          !originalMatch.horizontal ? originalMatch.index : undefined,
        );

        if (index > -1) {
          total += index + 1;
          break;
        }
      }

      // No match found, flip the space back and move on
      valueToToggle.isRock = !valueToToggle.isRock;
    }
    p++;
  }
  log(total);
};

const start = async (file: string) => {
  const content = fs.readFileSync(path.join(__dirname, file), 'utf8');

  const patterns = parseInput(content);

  //part1(patterns);
  part2(patterns);
};

//start('./files/example.txt');
start('./files/input.txt');
