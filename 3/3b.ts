import fs from 'fs';
import { EOL } from 'os';
import path from 'path';

//const file = '3.example.txt';
const file = '3.input.txt';

const priority = (item: string) =>
  'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
    .split('')
    .indexOf(item) + 1;

const findTriplicate = (pack1: string, pack2: string, pack3: string) => {
  for (const char1 of pack1) {
    for (const char2 of pack2) {
      for (const char3 of pack3) {
        if (char1 == char2 && char1 == char3) {
          return char1;
        }
      }
    }
  }

  throw 'No triplicate found';
};

const start = async () => {
  const content = fs.readFileSync(path.join(__dirname, file), 'utf8');
  const lines = content.split(EOL);

  const size = 3;
  let total = 0;

  for (let i = 0; i < lines.length; i += size) {
    total += priority(findTriplicate(lines[i], lines[i + 1], lines[i + 2]));
  }

  console.log(total);
};

start();
