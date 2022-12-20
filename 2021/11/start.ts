import { Grid } from '@utils/grid';
import fs from 'fs';
import path from 'path';
import { Octopus } from './types';
import { parseInput } from './utils';

//const file = './files/example.txt';
const file = './files/input.txt';

const renderGrid = (grid: Grid<Octopus>): void => {
  for (const row of grid.Values)
    console.log(row.reduce((a, b) => a + b.value.toString(), ''));
  console.log();
};

const start = async () => {
  const content = fs.readFileSync(path.join(__dirname, file), 'utf8');

  const grid = parseInput(content);

  const steps = 500;
  let flashes = 0;

  const needToFlash = (o: Octopus) => o.value > 9 && !o.flashed;
  const haveFlashed = (o: Octopus) => o.flashed;

  for (let step = 0; step < steps; step++) {
    // Update every octopus
    grid.Values.flat().forEach((octopus) => {
      octopus.value++;
    });

    // Keep working through octopuses until enough have flashed that need to
    while (grid.Values.flat().some(needToFlash)) {
      grid.Values.flat()
        .filter(needToFlash)
        .forEach((octopus) => {
          octopus.flashed = true;
          flashes++;
          grid.getNeighbours(octopus, false).forEach((o) => {
            o.value++;
          });
        });
    }

    let flashed = 0;
    // Reset all octopuses
    grid.Values.flat()
      .filter(haveFlashed)
      .forEach((o) => {
        o.flashed = false;
        o.value = 0;
        flashed++;
      });

    if (flashed === 100) {
      console.log('All flashed at ' + (step + 1));
      return;
    }
  }

  console.log(flashes);
};

start();
