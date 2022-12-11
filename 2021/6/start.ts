import toSum from '@utils/toSum';
import fs from 'fs';
import { EOL } from 'os';
import path from 'path';

//const file = './files/example.txt';
const file = './files/input.txt';

const start = async () => {
  const content = fs.readFileSync(path.join(__dirname, file), 'utf8');

  const fish: number[] = [...Array(9)].map((_) => 0);
  content.split(',').forEach((x) => fish[parseInt(x)]++);

  const days = 256;

  for (let day = 0; day < days; day++) {
    const n = fish.shift()!;
    fish[6] += n;
    fish.push(n);
  }

  console.log(fish);
  console.log(fish.reduce(toSum));
};

start();
