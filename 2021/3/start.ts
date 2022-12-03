import fs from 'fs';
import { EOL } from 'os';
import path from 'path';

//const file = './files/example.txt';
const file = './files/input.txt';

const start = async () => {
  const content = fs.readFileSync(path.join(__dirname, file), 'utf8');

  const lines = content.split(EOL);
  const seedArray = lines[0].split('').map((x) => 0);

  const finalValue = lines.reduce((array, line) => {
    line.split('').forEach((val, index) => {
      array[index] += val === '1' ? 1 : -1;
    });
    return array;
  }, seedArray);

  const gamma = parseInt(finalValue.map((x) => (x < 0 ? 0 : 1)).join(''), 2);
  const epsilon = parseInt(finalValue.map((x) => (x > 0 ? 0 : 1)).join(''), 2);

  console.log(gamma);
  console.log(epsilon);
  console.log(gamma * epsilon);
};

start();
