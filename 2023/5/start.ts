import fs from 'fs';
import path from 'path';
import { parseInput } from './utils';
import { Almanac } from './types';

const debugMode = true;
const debug = (...params: any[]) => debugMode && console.log(...params);
const log = (...params: any[]) => console.log(...params);

const part1 = (almanac: Almanac) => {
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

  for (const seed of almanac.seeds) {
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

  log('Lowest: ' + lowest);
};

const start = async (file: string) => {
  const content = fs.readFileSync(path.join(__dirname, file), 'utf8');

  const almanac = parseInput(content);

  //console.log(almanac);

  part1(almanac);
};

//start('./files/example.txt');
start('./files/input.txt');
