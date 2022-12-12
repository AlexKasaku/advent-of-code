import difference from '@utils/difference';
import findAndRemove from '@utils/findAndRemove';
import intersect from '@utils/intersect';
import setsAreEqual from '@utils/setsAreEqual';
import toSum from '@utils/toSum';
import fs from 'fs';
import { EOL } from 'os';
import path from 'path';

//const file = './files/example.txt';
const file = './files/input.txt';

type Display = {
  inputs: string[];
  digits: string[];
};

const parseInput = (content: string): Display[] =>
  content.split(EOL).map((l) => {
    const [inputSegments, digitsSegments] = l.split(' | ');

    const parsePieces = (val: string) =>
      val
        .split(' ')
        .map((x) => x.trim())
        .filter((x) => x);

    return {
      inputs: parsePieces(inputSegments),
      digits: parsePieces(digitsSegments),
    };
  });

// How to determine nums, ordered for logical deduction:

// 1 - length 2
// 4 - length 4
// 7 - length 3
// 8 - length 7
// 3 - length 5, contains 1's segments - 3 | 1 = 3
// 5 - Length 5 - 5 | (4 not in 1) = 5
// 2 - Length 5, remaining after 5 & 3 identified
// 6 - Length 6, does not contain all of 1's segments - 6 | 1 != 9
// 9 - length 6, contains 4's segments - 9 | 4 = 9
// 0 - length 6, does not contain 4's segments - 0 | 4 != 0

const getDisplayValue = (display: Display): number => {
  // Deducate all the digits first
  const digit1 = findAndRemove(display.inputs, (x) => x.length == 2)[0];
  const digit4 = findAndRemove(display.inputs, (x) => x.length == 4)[0];
  const digit7 = findAndRemove(display.inputs, (x) => x.length == 3)[0];
  const digit8 = findAndRemove(display.inputs, (x) => x.length == 7)[0];

  // 3 - length 5, contains 1's segments - 3 | 1 = 3
  const digit3 = findAndRemove(
    display.inputs,
    (x) =>
      x.length == 5 &&
      setsAreEqual(new Set([...x.split(''), ...digit1.split('')]), new Set(x))
  )[0];

  // 5 - Length 5 - 5 | (4 not in 1) = 5
  const digit5 = findAndRemove(
    display.inputs,
    (x) =>
      x.length == 5 &&
      setsAreEqual(
        new Set([
          ...difference(digit4.split(''), digit1.split('')),
          ...x.split(''),
        ]),
        new Set(x)
      )
  )[0];

  // 2 - Length 5, remaining after 5 & 3 identified
  const digit2 = findAndRemove(display.inputs, (x) => x.length == 5)[0];

  // 6 - Length 6, does not contain all of 1's segments - 6 | 1 != 9
  const digit6 = findAndRemove(
    display.inputs,
    (x) =>
      x.length == 6 &&
      intersect(digit1.split(''), x.split('')).length < digit1.length
  )[0];

  // 9 - length 6, contains 4's segments - 9 | 4 = 9
  const digit9 = findAndRemove(
    display.inputs,
    (x) =>
      x.length == 6 &&
      setsAreEqual(new Set([...x.split(''), ...digit4.split('')]), new Set(x))
  )[0];

  // 0 - last digit remaining
  const digit0 = display.inputs.shift();

  // Nicer ways to do this, but let's just push into an array for comparison and
  // use the index as the digit
  const digits: Set<string>[] = [];

  digits.push(new Set(digit0));
  digits.push(new Set(digit1));
  digits.push(new Set(digit2));
  digits.push(new Set(digit3));
  digits.push(new Set(digit4));
  digits.push(new Set(digit5));
  digits.push(new Set(digit6));
  digits.push(new Set(digit7));
  digits.push(new Set(digit8));
  digits.push(new Set(digit9));

  // Now work out the display
  let displayValue: string = '';

  display.digits.forEach((d) => {
    displayValue += digits.findIndex((digit) =>
      setsAreEqual(digit, new Set(d))
    );
  });

  return parseInt(displayValue);
};

const start = async () => {
  const content = fs.readFileSync(path.join(__dirname, file), 'utf8');

  const displays = parseInput(content);

  const total = displays.map((d) => getDisplayValue(d)).reduce(toSum);
  console.log(total);
};

start();
