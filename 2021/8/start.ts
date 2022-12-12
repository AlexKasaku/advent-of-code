import difference from '@utils/difference';
import findAndRemove from '@utils/findAndRemove';
import intersect from '@utils/intersect';
import setsAreEqual from '@utils/setsAreEqual';
import stringDifference from '@utils/stringDifference';
import stringIntersect from '@utils/stringIntersect';
import stringsAreEqualSets from '@utils/stringSetsAreEqual';
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
  const digits: string[] = new Array(10);

  digits[1] = findAndRemove(display.inputs, (x) => x.length == 2)[0];
  digits[4] = findAndRemove(display.inputs, (x) => x.length == 4)[0];
  digits[7] = findAndRemove(display.inputs, (x) => x.length == 3)[0];
  digits[8] = findAndRemove(display.inputs, (x) => x.length == 7)[0];

  // 3 - length 5, contains 1's segments - 3 | 1 = 3
  digits[3] = findAndRemove(
    display.inputs,
    (x) => x.length == 5 && stringsAreEqualSets(x + digits[1], x)
  )[0];

  // 5 - Length 5 - 5 | (4 not in 1) = 5
  digits[5] = findAndRemove(
    display.inputs,
    (x) =>
      x.length == 5 &&
      stringsAreEqualSets(stringDifference(digits[4], digits[1]) + x, x)
  )[0];

  // 2 - Length 5, remaining after 5 & 3 identified
  digits[2] = findAndRemove(display.inputs, (x) => x.length == 5)[0];

  // 6 - Length 6, does not contain all of 1's segments - 6 | 1 != 9
  digits[6] = findAndRemove(
    display.inputs,
    (x) =>
      x.length == 6 && stringIntersect(digits[1], x).length < digits[1].length
  )[0];

  // 9 - length 6, contains 4's segments - 9 | 4 = 9
  digits[9] = findAndRemove(
    display.inputs,
    (x) => x.length == 6 && stringsAreEqualSets(x + digits[4], x)
  )[0];

  // 0 - last digit remaining
  if (display.inputs.length != 1)
    throw (
      'Unexpected length of display.inputs remaining: ' + display.inputs.length
    );
  digits[0] = display.inputs[0];

  // Now work out the display
  // let displayValue: string = '';

  // display.digits.forEach((d) => {
  //   displayValue += digits.findIndex((digit) => stringsAreEqualSets(digit, d));
  // });

  return parseInt(
    display.digits.reduce(
      (a, b) => a + digits.findIndex((digit) => stringsAreEqualSets(digit, b)),
      ''
    )
  );
};

const start = async () => {
  const content = fs.readFileSync(path.join(__dirname, file), 'utf8');

  const displays = parseInput(content);

  const total = displays.map((d) => getDisplayValue(d)).reduce(toSum);
  console.log(total);
};

start();
