import fs from 'fs';
import path from 'path';
import { parseInput } from './utils';
import { Almanac, ItemMap } from './types';
import { chunk } from 'lodash';

const debugMode = true;
const debug = (...params: any[]) => debugMode && console.log(...params);
const log = (...params: any[]) => console.log(...params);

const start = async () => {
  // Test bed for trying out merging ranges;
  const maps: ItemMap[][] = [
    [{ source: 0, dest: 10, range: 10 }],
    [{ source: 5, dest: 15, range: 10 }],
  ];

  for (let seed = 0; seed < 30; seed++) {
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
          break;
        }
      }
    }

    debug(`${seed} ==> ${destination}`);
  }
};

start();
