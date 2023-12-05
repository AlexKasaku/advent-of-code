import fs from 'fs';
import path from 'path';
import { parseInput } from './utils';
import { Almanac } from './types';
import range from '@utils/range';
import { chunk } from 'lodash';

const debugMode = false;
const debug = (...params: any[]) => debugMode && console.log(...params);
const log = (...params: any[]) => console.log(...params);

// const expandSeedRange = (seedRanges: number[]) => {
//   const seeds = [];
//   for (let index = 0; index < seedRanges.length; index += 2) {
//     seeds.push(
//       ...range(
//         seedRanges[index],
//         seedRanges[index] + seedRanges[index + 1] - 1,
//       ),
//     );
//   }
//   return seeds;
// };

const run = (almanac: Almanac) => {
  const maps = [
    almanac.seedSoil,
    almanac.soilFertilizer,
    almanac.ferilizerWater,
    almanac.waterLight,
    almanac.lightTemp,
    almanac.tempHumidity,
    almanac.humidityLocation,
  ];

  let lowest = Number.MAX_SAFE_INTEGER;

  // Part 1
  //const processedSeeds = almanac.seeds;

  // Part 2
  const seedGroups = chunk(almanac.seeds, 2);

  for (const seedGroup of seedGroups) {
    for (
      let seed = seedGroup[0];
      seed < seedGroup[0] + seedGroup[1] - 1;
      seed++
    ) {
      debug('Seed ' + seed);
      let destination = seed;

      for (const map of maps) {
        for (const itemMap of map) {
          if (
            destination >= itemMap.source &&
            destination <= itemMap.source + itemMap.range - 1
          ) {
            const oldDest = destination;
            const diff = destination - itemMap.source;
            destination = itemMap.dest + diff;

            debug(`Mapped ${oldDest} => ${destination}`);
            break;
          }
        }
      }

      if (destination < lowest) lowest = destination;
    }
  }

  log('Lowest: ' + lowest);
};

const start = async (file: string) => {
  const content = fs.readFileSync(path.join(__dirname, file), 'utf8');

  const almanac = parseInput(content);

  run(almanac);
};

//start('./files/example.txt');
start('./files/input.txt');
