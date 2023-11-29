import { byDescending } from '@utils/sort';
import toSum from '@utils/toSum';
import fs from 'fs';
import { EOL } from 'os';
import path from 'path';

const start = async () => {
  const content = fs.readFileSync(path.join(__dirname, '1.input.txt'), 'utf8');

  const elves = content.split(EOL + EOL);
  const totals = elves.map((elf) =>
    elf
      .split(EOL)
      .map((x) => parseInt(x))
      .reduce(toSum)
  );

  const topThree = totals.sort(byDescending).slice(0, 3);
  const combined = topThree.reduce(toSum);

  console.log(topThree);
  console.log(combined);
};

start();
