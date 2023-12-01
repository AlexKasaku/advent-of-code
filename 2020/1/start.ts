import fs from 'fs';
import path from 'path';
import { parseInput } from './utils';

const debugMode = false;
const debug = (...params: any[]) => debugMode && console.log(...params);
const log = (...params: any[]) => console.log(...params);

const part1 = (numbers: number[]) => {
  // Scan through the list, for each number, determine what the other number must be to 2020 and see if it
  // is in the list, if it is then job done.
  for (let index = 0; index < numbers.length; index++) {
    const candidateOne = numbers[index];
    const findValue = 2020 - candidateOne;

    // We only need to look forward in the list, because if the matching pair was behind us, we would have found it already
    if (numbers.slice(index + 1).indexOf(findValue) > -1) {
      log(`Values are ${candidateOne} and ${findValue}`);
      log(`Product is ${candidateOne * findValue}`);
      break;
    }
  }
};

const part2 = (numbers: number[]) => {
  // Scan through the list, for each number, determine what the other number must be to 2020 and see if it
  // is in the list, if it is then job done.
  for (let index = 0; index < numbers.length; index++) {
    const candidateOne = numbers[index];
    const findSum = 2020 - candidateOne;

    const remainingNumbers = numbers.slice(index + 1);

    for (let indexTwo = 0; indexTwo < remainingNumbers.length; indexTwo++) {
      const candidateTwo = remainingNumbers[indexTwo];
      const findValue = findSum - candidateTwo;

      // We only need to look forward in the list, because if the matching pair was behind us, we would have found it already
      if (remainingNumbers.slice(indexTwo + 1).indexOf(findValue) > -1) {
        log(`Values are ${candidateOne}, ${candidateTwo}, and ${findValue}`);
        log(`Product is ${candidateOne * candidateTwo * findValue}`);
        break;
      }
    }
  }
};

const start = async (file: string) => {
  const content = fs.readFileSync(path.join(__dirname, file), 'utf8');
  const numbers = parseInput(content).map((x) => parseInt(x));

  //part1(numbers);
  part2(numbers);
};

//start('./files/example.txt');
start('./files/input.txt');
