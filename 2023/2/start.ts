import fs from 'fs';
import path from 'path';
import { GameSetup } from './types';
import { parseInput } from './utils';

const debugMode = false;
const debug = (...params: any[]) => debugMode && console.log(...params);
const log = (...params: any[]) => console.log(...params);

const start = async (file: string) => {
  const content = fs.readFileSync(path.join(__dirname, file), 'utf8');

  const gameSetup: GameSetup[] = parseInput(content);

  // Part 1
  // What is possible with 12 red cubes, 13 green cubes, and 14 blue cubes?
  let idTotal = 0;

  for (const { id, rounds } of gameSetup) {
    let possibleGame = true;
    for (const round of rounds) {
      if (round.red > 12 || round.green > 13 || round.blue > 14)
        possibleGame = false;
    }
    if (possibleGame) idTotal += id;
  }

  log(idTotal);
};

//start('./files/example.txt');
start('./files/input.txt');
