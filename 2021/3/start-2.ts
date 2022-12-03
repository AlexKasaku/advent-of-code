import fs from 'fs';
import { EOL } from 'os';
import path from 'path';

const file = './files/example.txt';
//const file = './files/input.txt';

const determineMostCommonBits = (lines: string[]) =>
  lines.reduce(
    (array, line) => {
      line.split('').forEach((val, index) => {
        array[index] += val === '1' ? 1 : -1;
      });
      return array;
    },
    lines[0].split('').map((x) => 0)
  );

const calculate = (candidates: string[], oxygen: boolean) => {
  let bitIndex = 0;
  while (candidates.length > 1) {
    const finalValue = determineMostCommonBits(candidates);
    const filterValue = finalValue[bitIndex] < 0 ? '0' : '1';

    candidates = candidates.filter(
      (x) => (x[bitIndex] === filterValue) === oxygen
    );
    bitIndex++;
  }
  return parseInt(candidates[0], 2);
};

const start = async () => {
  const content = fs.readFileSync(path.join(__dirname, file), 'utf8');

  const lines = content.split(EOL);

  const oxygen = calculate(lines, true);
  const co = calculate(lines, false);

  console.log(oxygen);
  console.log(co);
  console.log(oxygen * co);
};

start();
