import toSum from '@utils/toSum';
import fs from 'fs';
import { EOL } from 'os';
import path from 'path';

//const file = './files/example.txt';
const file = './files/input.txt';

type List = (number | List)[];
type Pair = { left: List; right: List };

const debug = false;

const debugPair = (indent: number, left: List, right: List) => {
  debugIndentOutput(
    indent,
    `${JSON.stringify(left)} vs ${JSON.stringify(right)}`
  );
};

const debugIndentOutput = (indent: number, ...params: any): void => {
  if (!debug) return;
  [...Array(indent)].forEach(() => process.stdout.write('  '));
  console.log(...params);
};

const parseList = (list: string): List => {
  if (!list.match(/[\[,\]\d]+/)) throw 'Unsupported list structure';

  return eval(list);
};

const parseInput = (input: string): Pair[] =>
  input.split(EOL + EOL).map((p) => {
    const [left, right] = p.split(EOL);

    return {
      left: parseList(left),
      right: parseList(right),
    };
  });

const isInteger = (value: number | List): value is number =>
  typeof value === 'number';

export const compareLists = (left: List, right: List, indent: number = 0) =>
  innerCompare(left, right, indent) > 0;

export const innerCompare = (
  left: List,
  right: List,
  indent: number = 0
): number => {
  debugPair(indent, left, right);

  for (const leftValue of left) {
    const rightValue = right.shift();

    // Left list has run out of values
    if (rightValue === undefined) {
      debugIndentOutput(indent, 'No right value when needed, returning -1');
      return -1;
    }

    // If both are integers
    if (isInteger(leftValue) && isInteger(rightValue)) {
      if (rightValue < leftValue) {
        debugIndentOutput(indent, 'Right value is lower');
        return -1;
      }
      if (rightValue > leftValue) return 1;
    } else {
      // One or both are lists, ensure both are lists and call again
      const leftList = !isInteger(leftValue) ? leftValue : [leftValue];
      const rightList = !isInteger(rightValue) ? rightValue : [rightValue];

      const compared = innerCompare(leftList, rightList, indent + 1);

      if (compared != 0) {
        debugIndentOutput(indent, 'Sublist comparison was ' + compared);
        return compared;
      }
    }
  }

  // In correct order if right still has items, otherwise we don't know.
  return right.length > 0 ? 1 : 0;
};

const start = async () => {
  const content = fs.readFileSync(path.join(__dirname, file), 'utf8');

  const pairs = parseInput(content);

  const total = pairs
    .map((p, index) => {
      console.log(`\nPair ${index + 1}`);
      const compared = compareLists(p.left, p.right);
      console.log(`Result: ${compared}`);

      return compared ? index + 1 : 0;
    })
    .reduce(toSum);

  // const total = pairs
  //   .map((p, index) => (compareLists(p.left, p.right) ? index + 1 : 0))
  //   .reduce(toSum);

  console.log(total);
};

start();
