import fs from 'fs';
import path from 'path';
import { calculateBestGeodeCount, parseInput } from './utils';

const file = './files/example.txt';
//const file = './files/test.txt';
//const file = './files/input.txt';

const start = async () => {
  const content = fs.readFileSync(path.join(__dirname, file), 'utf8');

  let blueprints = parseInput(content);

  // Part 1:
  //const timeLimit = 24;
  //let value = 0;

  // Part 2:
  const timeLimit = 32;
  blueprints = blueprints.slice(0, 3);
  let value = 1;

  for (const blueprint of blueprints) {
    const highestGeodeCount = calculateBestGeodeCount(blueprint, timeLimit);
    console.log(highestGeodeCount);

    // Part 1
    //value += highestGeodeCount * blueprint.id;

    // Part 2
    value *= highestGeodeCount;
  }

  console.log(value);
};

start();
