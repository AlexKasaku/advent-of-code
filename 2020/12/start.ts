import fs from 'fs';
import path from 'path';
import { parseInput } from './utils';

const debugMode = true;
const debug = (...params: any[]) => debugMode && console.log(...params);
const log = (...params: any[]) => console.log(...params);

const start = async (file: string) => {
  const content = fs.readFileSync(path.join(__dirname, file), 'utf8');

  const instructions = parseInput(content);

  const bearings = ['N', 'E', 'S', 'W'] as const;
  type Bearing = (typeof bearings)[number];
  let bearing: Bearing = 'E';
  let north = 0,
    east = 0;

  const moveInDirection = (direction: Bearing, value: number) => {
    switch (direction) {
      case 'N':
        north += value;
        break;
      case 'S':
        north -= value;
        break;
      case 'E':
        east += value;
        break;
      case 'W':
        east -= value;
        break;
    }
  };

  for (const { command, value } of instructions) {
    switch (command) {
      case 'N':
      case 'S':
      case 'E':
      case 'W':
        moveInDirection(command, value);
        break;

      case 'L':
        bearing =
          bearings[
            (bearings.indexOf(bearing) + 4 - value / 90) % bearings.length
          ];
        break;
      case 'R':
        bearing =
          bearings[
            (bearings.indexOf(bearing) + 4 + value / 90) % bearings.length
          ];
        break;
      case 'F':
        moveInDirection(bearing, value);
        break;
    }
    debug(`N: ${north}\tE: ${east}`);
  }

  const distance = Math.abs(north) + Math.abs(east);
  log(distance);
};

//start('./files/example.txt');
start('./files/input.txt');
