import fs from 'fs';
import path from 'path';
import { parseInput } from './utils';
import { byAscending } from '@utils/sort';

const debugMode = false;
const debug = (...params: any[]) => debugMode && console.log(...params);
const log = (...params: any[]) => console.log(...params);

const findInvalidNumber = (preamble: number, numbers: number[]) => {
  for (let index = preamble; index < numbers.length; index++) {
    const numberToTest = numbers[index];
    const candidates = numbers.slice(index - preamble, index);

    let foundMatch = false;
    for (
      let candidateIndex = 0;
      candidateIndex < candidates.length;
      candidateIndex++
    ) {
      const candidateOne = candidates[candidateIndex];
      const findValue = numberToTest - candidateOne;

      // We only need to look forward in the list, because if the matching pair was behind us, we would have found it already
      if (candidates.slice(candidateIndex + 1).indexOf(findValue) > -1) {
        debug(
          `Match found as ${candidateOne} + ${findValue} = ${numberToTest}`,
        );
        foundMatch = true;
        break;
      }
    }
    if (!foundMatch) {
      return numberToTest;
    }
  }
  throw 'Could not find invalid number';
};

const start = async (file: string, preamble: number) => {
  const content = fs.readFileSync(path.join(__dirname, file), 'utf8');

  const numbers = parseInput(content);

  // Part 1
  const invalidNumber = findInvalidNumber(preamble, numbers);
  log(invalidNumber);

  // Part 2

  // We only need numbers that run up to the invalid number, let's drop the rest.
  const numberSubset = numbers.slice(0, numbers.indexOf(invalidNumber));

  // Reverse the numbers as they generally increase in value, which will make finding matches quicker
  numberSubset.reverse();

  for (let index = 0; index < numberSubset.length; index++) {
    let total = 0;
    const group: number[] = [];
    let groupIndex = 0;

    while (total < invalidNumber) {
      const val = numberSubset[index + groupIndex];
      group.push(val);
      total += val;
      groupIndex++;
    }

    if (total === invalidNumber) {
      group.sort(byAscending);
      log(group[0] + group[group.length - 1]);
      return;
    }
  }
};

//start('./files/example.txt', 5);
start('./files/input.txt', 25);
