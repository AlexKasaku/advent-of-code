import fs from 'fs';
import path from 'path';
import { parseInput } from './utils';
import { parseInputPart2 } from '2021/15/utils';
import lowestCommonMultiple from '@utils/lowestCommonMultiple';

const debugMode = false;
const debug = (...params: any[]) => debugMode && console.log(...params);
const log = (...params: any[]) => console.log(...params);

const part1 = (busIds: (number | 'x')[], earliestDeparture: number) => {
  let nearestToDeparture = Number.MAX_SAFE_INTEGER;
  let busId = 0;

  for (const bus of busIds
    .filter((b) => typeof b === 'number')
    .map((b) => b as number)) {
    const afterDeparture =
      earliestDeparture + (bus - (earliestDeparture % bus));
    if (afterDeparture < nearestToDeparture) {
      nearestToDeparture = afterDeparture;
      busId = bus;
    }
  }

  log(
    `After ${earliestDeparture}, bus ${busId} will depart at ${nearestToDeparture}`,
  );
  log((nearestToDeparture - earliestDeparture) * busId);
};

const part2 = (busIds: (number | 'x')[]) => {
  const busIdWithOffsets = busIds
    .map((b, i) => (b === 'x' ? undefined : { id: b, offset: i }))
    .filter((b) => b !== undefined) as { id: number; offset: number }[];

  let time = 0;
  const groups = [busIdWithOffsets.shift()!] as {
    id: number;
    offset: number;
  }[];
  let multiplier = groups[0].id;

  while (true) {
    time += multiplier;

    if (groups.every((b, i) => (time + b.offset) % b.id === 0)) {
      log(`Time: ${time}`);
      multiplier = lowestCommonMultiple(...groups.map((g) => g.id));
      log(`Delta: ${multiplier}`);

      const nextEntry = busIdWithOffsets.shift();
      if (nextEntry === undefined) break;

      groups.push(nextEntry);
      time = time % multiplier;
    }
  }
};

const start = async (file: string) => {
  const content = fs.readFileSync(path.join(__dirname, file), 'utf8');

  const { earliestDeparture, busIds } = parseInput(content);

  // Part 1
  //part1(busIds, earliestDeparture);

  part2(busIds);
};

//start('./files/example.txt');
start('./files/input.txt');
