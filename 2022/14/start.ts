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

  //console.log(points);
  const grid = createGridFromPoints(points, true);

  //const sandSpawn: Point[] = [{ x: 500, y: 0 }];
  type Sand = Point & { spawnedFrom: Point };
  const sandsInMotion: Sand[] = [
    { x: 500, y: 0, spawnedFrom: { x: 500, y: 0 } },
  ];

  // Using cycles for infinite-loop protection, if this runs out before puzzle is done
  // then likely there's a problem.
  let cycle = 0;
  const maxCycles = 9000000;

  let sandAtRest = 0;
  for (; cycle < maxCycles; cycle++) {
    // For each sand in motion
    for (const sandInMotion of sandsInMotion) {
      const nextPoint = getNextPointForSand(grid, sandInMotion);

      switch (nextPoint) {
        case 'off':
          // Finished!
          renderGrid(grid);
          console.log(
            `Sand off grid! Total sand at rest: ${sandAtRest} (took ${cycle} cycles)`
          );
          return;

        case 'rest':
          // Store this sand in the grid
          sandAtRest++;
          grid.set(sandInMotion, { ...sandInMotion, content: 'sand' });

          // Part 2: Is this point the sand spawn? If so then done!
          if (
            sandInMotion.x === sandInMotion.spawnedFrom.x &&
            sandInMotion.y === sandInMotion.spawnedFrom.y
          ) {
            renderGrid(grid);
            console.log(
              `Sand reached spawn point! Total sand at rest: ${sandAtRest} (took ${cycle} cycles)`
            );
            return;
          }

          // Remove this sand in motion
          findAndRemove(
            sandsInMotion,
            (val) => val.x == sandInMotion.x && val.y == sandInMotion.y
          );

          // Spawn next sand
          sandsInMotion.push({
            x: sandInMotion.spawnedFrom.x,
            y: sandInMotion.spawnedFrom.y,
            spawnedFrom: sandInMotion.spawnedFrom,
          });
          break;

        default: {
          // Sand continues to move, update it's position
          sandInMotion.x = nextPoint.x;
          sandInMotion.y = nextPoint.y;
        }
      }
    }
  }

  if ((cycle = maxCycles)) console.log('Ran out of cycles');

  renderGrid(grid);
};

start();
