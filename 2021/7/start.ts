import { byDescending } from '@utils/sort';
import fs from 'fs';
import { EOL } from 'os';
import path from 'path';

//const file = './files/example.txt';
const file = './files/input.txt';

const start = async () => {
  const content = fs.readFileSync(path.join(__dirname, file), 'utf8');

  const values = content.split(',').map((x) => parseInt(x));
  const maxValue = values.sort(byDescending)[0];

  let lowestFuelCost = Number.MAX_SAFE_INTEGER;

  for (let x = 1; x < maxValue; x++) {
    let currentFuelSpend = 0;

    for (let currentVal = 0; currentVal < values.length; currentVal++) {
      // Part 1
      //const currentFuelSpend += Math.abs(values[currentVal] - x);

      // Part 2
      const distance = Math.abs(values[currentVal] - x);
      currentFuelSpend += (distance * (distance + 1)) / 2;

      if (currentFuelSpend > lowestFuelCost) {
        break;
      }
    }

    console.log(`${x} would cost ${currentFuelSpend}`);

    if (currentFuelSpend < lowestFuelCost) {
      lowestFuelCost = currentFuelSpend;
    }
  }

  console.log(lowestFuelCost);
};

start();
