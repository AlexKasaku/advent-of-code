import toSum from '@utils/toSum';
import fs from 'fs';
import { EOL } from 'os';
import path from 'path';
import { List, Pair } from './types';
import { innerCompare } from './utils';

//const file = './files/example.txt';
const file = './files/input.txt';

const parseList = (list: string): List => {
  if (!list.match(/[[,\]\d]+/)) throw 'Unsupported list structure';

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

const start = async () => {
  const content = fs.readFileSync(path.join(__dirname, file), 'utf8');

  const pairs = parseInput(content);

  // Part 1
  // const total = pairs
  //   .map((p, index) => {
  //     console.log(`\nPair ${index + 1}`);
  //     const compared = compareLists(p.left, p.right);
  //     console.log(`Result: ${compared}`);

  //     return compared ? index + 1 : 0;
  //   })
  //   .reduce(toSum);
  // console.log(total);

  // Part 2
  const completeList = pairs.flatMap((x) => [x.left, x.right]);
  completeList.push([[2]]);
  completeList.push([[6]]);

  const sortedList = completeList.sort((a, b) => {
    const c = innerCompare(b, a);

    if (c == 0) console.log('c == 0');
    return c;
  });

  sortedList.forEach((l, i) => {
    console.log(`${i + 1} - ${JSON.stringify(l)}`);
  });

  const index2 =
    sortedList.findIndex((x) => JSON.stringify(x) === JSON.stringify([[2]])) +
    1;
  const index6 =
    sortedList.findIndex((x) => JSON.stringify(x) === JSON.stringify([[6]])) +
    1;

  console.log(index2);
  console.log(sortedList[index2 - 1]);
  console.log(index6);
  console.log(sortedList[index6 - 1]);
  console.log(index2 * index6);

  // Not 22781
};

start();
