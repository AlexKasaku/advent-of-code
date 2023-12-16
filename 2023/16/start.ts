import fs from 'fs';
import path from 'path';
import { getNewPositions, parseInput } from './utils';
import { PositionAndDirection } from './types';
import { Position } from '@utils/grid';

const debugMode = true;
const debug = (...params: any[]) => debugMode && console.log(...params);
const log = (...params: any[]) => console.log(...params);

const toSetKeyWithDirection = ({ x, y, direction }: PositionAndDirection) =>
  `${x},${y},${direction}`;
const toSetKey = ({ x, y }: Position) => `${x},${y}`;

const start = async (file: string) => {
  const content = fs.readFileSync(path.join(__dirname, file), 'utf8');

  const grid = parseInput(content);

  // Track how many spaces have been visited by a laser in a given direction
  // already to prevent repeats.
  const visitedSpacesWithDirection = new Set<string>();
  const visitedSpaces = new Set<string>();

  const stack: PositionAndDirection[] = [{ x: 0, y: 0, direction: 'E' }];

  while (stack.length > 0) {
    const thisPositionAndDirection = stack.shift()!;

    //debug(thisPositionAndDirection);

    // Work out next position
    const newPositions = getNewPositions(grid, thisPositionAndDirection);

    // Add to stack if not already visited
    newPositions.forEach((p) => {
      const setKey = toSetKeyWithDirection(p);
      if (!visitedSpacesWithDirection.has(setKey)) stack.push(p);
    });

    // Mark this as visited
    visitedSpacesWithDirection.add(
      toSetKeyWithDirection(thisPositionAndDirection),
    );
    visitedSpaces.add(toSetKey(thisPositionAndDirection));
  }

  log(`Visited spaces: ${visitedSpaces.size}`);
};

//start('./files/example.txt');
start('./files/input.txt');
