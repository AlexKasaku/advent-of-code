import { parseInputPart2 } from '2021/15/utils';
import fs from 'fs';
import { partial } from 'lodash';
import path from 'path';
import { GameSetup } from './types';
import { parseInput } from './utils';

const debugMode = false;
const debug = (...params: any[]) => debugMode && console.log(...params);
const log = (...params: any[]) => console.log(...params);

const part1 = (gameSetup: GameSetup[]) => {
  let idTotal = 0;

  for (const { id, rounds } of gameSetup) {
    let possibleGame = true;
    for (const round of rounds) {
      if (round.red > 12 || round.green > 13 || round.blue > 14)
        possibleGame = false;
    }
    if (possibleGame) idTotal += id;
  }

  log(`Part 1: ${idTotal}`);
};

const part2 = (gameSetup: GameSetup[]) => {
  let powerTotal = 0;

  for (const { rounds } of gameSetup) {
    let minRed = 0;
    let minGreen = 0;
    let minBlue = 0;

    for (const round of rounds) {
      if (round.red > minRed) minRed = round.red;
      if (round.green > minGreen) minGreen = round.green;
      if (round.blue > minBlue) minBlue = round.blue;
    }

    const power = minRed * minGreen * minBlue;
    powerTotal += power;
  }

  log(`Part 2: ${powerTotal}`);
};

const start = async (file: string) => {
  const content = fs.readFileSync(path.join(__dirname, file), 'utf8');

  const gameSetup: GameSetup[] = parseInput(content);

  // Part 1
  // What is possible with 12 red cubes, 13 green cubes, and 14 blue cubes?
  part1(gameSetup);

  // Part 2
  // Find minimum number of cubes required to satisfy games
  part2(gameSetup);
};

//start('./files/example.txt');
start('./files/input.txt');
