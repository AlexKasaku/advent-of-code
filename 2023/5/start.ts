import fs from 'fs';
import path from 'path';
import { parseInput } from './utils';
import { Almanac } from './types';
import range from '@utils/range';
import { chunk } from 'lodash';

const debugMode = true;
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

  const reverseMaps = maps.reverse();
  const seedGroups = chunk(almanac.seeds, 2);

  let testLocation = 1;

  while (true) {
    if (testLocation % 10000000 == 0) debug(`Testing location ${testLocation}`);

    // Work backwards through maps to find the seed number that would result in this end location
    let sourceLocation = testLocation;

    for (const map of reverseMaps) {
      for (const itemMap of map) {
        if (
          sourceLocation >= itemMap.dest &&
          sourceLocation <= itemMap.dest + itemMap.range - 1
        ) {
          const diff = sourceLocation - itemMap.dest;
          sourceLocation = itemMap.source + diff;
          break;
        }
      }
    }

    //Is that seed in the seed map? If so then it's the lowest!
    for (const seedGroup of seedGroups) {
      if (
        sourceLocation >= seedGroup[0] &&
        sourceLocation <= seedGroup[0] + seedGroup[1] - 1
      ) {
        log(`${testLocation} is lowest end location!`);
        return;
      }
    }

    testLocation++;
  }
};

const start = async (file: string) => {
  const content = fs.readFileSync(path.join(__dirname, file), 'utf8');

  const almanac = parseInput(content);

  run(almanac);
};

//start('./files/example.txt');
start('./files/input.txt');
