import fs from 'fs';
import readline from 'readline';
import path from 'path';

const start = async () => {
  const rl = readline.createInterface({
    input: fs.createReadStream(path.join(__dirname, '1.input.txt')),
    crlfDelay: Infinity,
  });

  let current = 0;
  const elves = [];

  for await (const line of rl) {
    if (line === '') {
      elves.push(current);
      current = 0;
      continue;
    }

    current += parseInt(line);
  }
  elves.push(current);

  const topThree = elves.sort((n1, n2) => n2 - n1).slice(0, 3);
  const total = topThree.reduce((x, y) => x + y);

  console.log(topThree);
  console.log(total);
};

start();
