import fs from 'fs';
import path from 'path';
import { parseInput } from './utils';
import { Space } from './types';
import { Position } from '@utils/grid';
import transpose from '@utils/transpose';

const debugMode = true;
const debug = (...params: any[]) => debugMode && console.log(...params);
const log = (...params: any[]) => console.log(...params);

const createPairs = (galaxies: Space[]) => {
  const pairs = [];

  for (let i = 0; i < galaxies.length - 1; i++) {
    for (let j = i; j < galaxies.length - 1; j++) {
      pairs.push([galaxies[i], galaxies[j + 1]]);
    }
  }

  return pairs;
};

const manhattanDistance = (a: Position, b: Position) =>
  Math.abs(a.x - b.x) + Math.abs(a.y - b.y);

const findEmptyRowIndexes = (gridValues: Space[][]): number[] => {
  return gridValues
    .map((row, index) => (row.every((s) => !s.isGalaxy) ? index : undefined))
    .filter((i) => i !== undefined) as number[];
};

const start = async (file: string) => {
  const content = fs.readFileSync(path.join(__dirname, file), 'utf8');

  const grid = parseInput(content);
  const galaxies = grid.Values.flat().filter((x) => x.isGalaxy);
  const galaxyPairs = createPairs(galaxies);

  const emptyRowIndexes = findEmptyRowIndexes(grid.Values);
  const emptyColumnIndexes = findEmptyRowIndexes(transpose(grid.Values));

  debug(`Empty rows: ${emptyRowIndexes}`);
  debug(`Empty columns: ${emptyColumnIndexes}`);

  let totalDistance = 0;

  // Part 1
  const expansionFactor = 2;

  // Part 2
  //const expansionFactor = 1000000;

  for (const pair of galaxyPairs) {
    // Shortest distance in a grid is just the Manhatten distance
    const distance = manhattanDistance(pair[0], pair[1]);

    // For every empty row + column we cross, we need to increase the distance.
    const emptyRowsCrossed = emptyRowIndexes.filter(
      (v) =>
        v >= Math.min(pair[0].y, pair[1].y) &&
        v <= Math.max(pair[0].y, pair[1].y),
    ).length;
    const emptyColumnsCrossed = emptyColumnIndexes.filter(
      (v) =>
        v >= Math.min(pair[0].x, pair[1].x) &&
        v <= Math.max(pair[0].x, pair[1].x),
    ).length;

    totalDistance +=
      distance +
      emptyRowsCrossed * (expansionFactor - 1) +
      emptyColumnsCrossed * (expansionFactor - 1);
  }

  log(`Total distance: ${totalDistance}`);
};

//start('./files/example.txt');
start('./files/input.txt');
