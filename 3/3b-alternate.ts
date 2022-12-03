import fs from 'fs';
import { EOL } from 'os';
import path from 'path';

//const file = '3.example.txt';
const file = '3.input.txt';

// Improvements over submitted:
//
// - used reduce function
// - findTriplicate breaks early

const priority = (item: string) =>
  'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
    .split('')
    .indexOf(item) + 1;

const findTriplicate = (pack1: string, pack2: string, pack3: string) => {
  for (const char1 of pack1) {
    for (const char2 of pack2) {
      if (char1 !== char2) continue;
      for (const char3 of pack3) {
        if (char1 == char2 && char1 == char3) {
          return char1;
        }
      }
    }
  }

  throw 'No triplicate found';
};

const groupLines = (lines: string[], size: number) =>
  lines.reduce((groups, current, index) => {
    if (index % size === 0) last.push([]);

    groups[last.length - 1].push(current);

    return groups;
  }, [] as string[][]);

const start = async () => {
  const content = fs.readFileSync(path.join(__dirname, file), 'utf8');
  const lines = content.split(EOL);
  const size = 3;

  const total = groupLines(lines, size)
    .map((group) => priority(findTriplicate(group[0], group[1], group[2])))
    .reduce((x, y) => x + y);

  console.log(total);
};

start();
