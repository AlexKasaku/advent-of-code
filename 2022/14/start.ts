import findAndRemove from '@utils/findAndRemove';
import fs from 'fs';
import path from 'path';
import { Point } from './types';
import {
  createGridFromPoints,
  getNextPointForSand,
  parsePoints,
  renderGrid,
} from './utils';

//const file = './files/example.txt';
const file = './files/input.txt';

const start = async () => {
  const content = fs.readFileSync(path.join(__dirname, file), 'utf8');
  const points = parsePoints(content);

  const grid = createGridFromPoints(points, true);

  type Sand = Point;
  const sandInMotion: Sand = { x: 500, y: 0 };

  // Using cycles for infinite-loop protection, if this runs out before puzzle is done
  // then likely there's a problem.
  let cycle = 0;
  const maxCycles = 9000000;

  let sandAtRest = 0;

  var startTime = performance.now();

  for (; cycle < maxCycles; cycle++) {
    //renderGrid(grid);

    // For each sand in motion
    const nextPoint = getNextPointForSand(grid, sandInMotion);

    switch (nextPoint) {
      case 'off':
        // Finished!
        //renderGrid(grid);
        console.log(
          `Sand off grid! Total sand at rest: ${sandAtRest} (took ${cycle} cycles)`
        );
        console.log(
          `Execution took ${performance.now() - startTime} milliseconds`
        );
        return;

      case 'rest':
        // Store this sand in the grid
        sandAtRest++;
        grid.get(sandInMotion)!.content = 'sand';

        // Part 2: Is this point the sand spawn? If so then done!
        if (sandInMotion.x === 500 && sandInMotion.y === 0) {
          //renderGrid(grid);
          console.log(
            `Sand reached spawn point! Total sand at rest: ${sandAtRest} (took ${cycle} cycles)`
          );
          console.log(
            `Execution took ${performance.now() - startTime} milliseconds`
          );

          return;
        }

        // Replace this sand in motion back to spawn
        sandInMotion.x = 500;
        sandInMotion.y = 0;
        break;

      default: {
        // Sand continues to move, update it's position
        sandInMotion.x = nextPoint.x;
        sandInMotion.y = nextPoint.y;
      }
    }
  }

  if ((cycle = maxCycles)) console.log('Ran out of cycles');
};

start();
