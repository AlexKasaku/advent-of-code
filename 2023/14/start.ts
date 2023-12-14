import fs from 'fs';
import path from 'path';
import { parseInput, renderGrid, tiltGrid } from './utils';
import toSum from '@utils/toSum';
import { Direction } from '@utils/grid';

const debugMode = true;
const debug = (...params: any[]) => debugMode && console.log(...params);
const log = (...params: any[]) => console.log(...params);

const start = async (file: string) => {
  const content = fs.readFileSync(path.join(__dirname, file), 'utf8');

  const grid = parseInput(content);

  const spinCycle = ['N', 'W', 'S', 'E'];
  let step = 0;
  let cycle = 1;
  const loads = [];

  // Go along enough until we'll hit repeats
  while (cycle < 200) {
    const direction = spinCycle[step % spinCycle.length] as Direction;
    tiltGrid(grid, direction);

    step++;
    if (step % spinCycle.length == 0) {
      // Finished a cycle
      const totalLoad = grid.Values.flat()
        .filter((r) => r.isRock && !r.isStaticRock)
        .map((r) => grid.Height - r.y)
        .reduce(toSum);

      debug(`Step: ${step}. Cycle: ${cycle}. Load: ${totalLoad}`);

      loads.push(totalLoad);
      cycle++;
    }
  }

  // Find the pattern to predict value at step 1000000000.
  // Assume a pattern size of under 50 that is repeating after 100 cycles.
  // It doesn't matter if this is double/treble the actual pattern as the maths is the same.
  const lastLoads = loads.slice(-100);
  let foundRepeatSize = 0;
  for (let repeatSize = lastLoads.length / 2; repeatSize > 0; repeatSize--) {
    let foundRepeat = true;
    for (let i = 0; i <= repeatSize; i++) {
      if (
        lastLoads[lastLoads.length - 1 - i] !==
        lastLoads[lastLoads.length - 1 - repeatSize - i]
      ) {
        foundRepeat = false;
        break;
      }
    }
    if (foundRepeat) {
      debug(`Repeat pattern length = ${repeatSize}`);
      foundRepeatSize = repeatSize;
      break;
    }
  }

  if (foundRepeatSize == 0) throw 'Could not identify repeating pattern';

  const repeat = loads.slice(-foundRepeatSize);
  debug(repeat);

  const end = 1000000000 - cycle;
  log(repeat[end % foundRepeatSize]);
};

//start('./files/example.txt');
start('./files/input.txt');
