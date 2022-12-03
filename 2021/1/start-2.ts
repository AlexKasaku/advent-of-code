import fs from 'fs';
import { EOL } from 'os';
import path from 'path';

//const file = './files/example.txt';
const file = './files/input.txt';

const start = async () => {
  const content = fs.readFileSync(path.join(__dirname, file), 'utf8');

  const total = content
    .split(EOL)
    .map((line) => parseInt(line))
    .reduce((total, _, index, array) => {
      if (index < 2) return [];

      total.push(array[index - 2] + array[index - 1] + array[index]);

      return total;
    }, [] as number[])
    .reduce(
      (total, current, index, array) =>
        total + (index > 0 ? (current > array[index - 1] ? 1 : 0) : 0),
      0
    );

  console.log(total);
};

start();
