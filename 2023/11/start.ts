import fs from 'fs';
import path from 'path';
import {
  createGridWithPositions,
  expandSpace,
  parseInput,
  renderGrid,
} from './utils';
import { SpaceWithPosition } from './types';
import { Position } from '@utils/grid';

const debugMode = false;
const debug = (...params: any[]) => debugMode && console.log(...params);
const log = (...params: any[]) => console.log(...params);

const createPairs = (galaxies: SpaceWithPosition[]) => {
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

const start = async (file: string) => {
  const content = fs.readFileSync(path.join(__dirname, file), 'utf8');

  const basicGrid = parseInput(content);
  const grid = createGridWithPositions(expandSpace(basicGrid));

  const galaxies = grid.Values.flat().filter((x) => x.isGalaxy);
  const galaxyPairs = createPairs(galaxies);

  let totalDistance = 0;

  for (const pair of galaxyPairs) {
    // Shortest distance in a grid is just the Manhatten distance
    const distance = manhattanDistance(pair[0], pair[1]);
    totalDistance += distance;
  }

  log(totalDistance);

  log(galaxyPairs.length);
};

//start('./files/example.txt');
start('./files/input.txt');
