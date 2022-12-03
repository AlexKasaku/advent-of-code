import fs from 'fs';
import { EOL } from 'os';
import path from 'path';

//const file = '3.example.txt';
const file = '3.input.txt';

const priority = (item: string) =>
  'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
    .split('')
    .indexOf(item) + 1;

const findDuplicate = (line: string) => {
  const half1 = line.substring(0, line.length / 2);
  const half2 = line.substring(line.length / 2);

  for (const char1 of half1) {
    for (const char2 of half2) {
      if (char1 == char2) {
        //console.log(char1);
        return char1;
      }
    }
  }

  throw 'No duplicate found';
};

const start = async () => {
  const content = fs.readFileSync(path.join(__dirname, file), 'utf8');

  const total = content
    .split(EOL)
    .map((line) => priority(findDuplicate(line)))
    .reduce((x, y) => x + y);

  console.log(total);
};

start();
