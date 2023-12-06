import fs from 'fs';
import path from 'path';
import { parseInputPart1, parseInputPart2 } from './utils';
import { Race } from './types';

const debugMode = false;
const debug = (...params: any[]) => debugMode && console.log(...params);
const log = (...params: any[]) => console.log(...params);

const run = (races: Race[]) => {
  let raceProduct = 1;

  for (const { time, distance } of races) {
    let waysToWin = 0;

    // Try each time, exclude 0 and full time, they won't win.
    for (let t = 1; t < time; t++) {
      const speed = t;
      const distanceAchieved = (time - t) * speed;
      if (distanceAchieved > distance) waysToWin++;
    }

    log(`Ways to win: : ${waysToWin}`);

    raceProduct *= waysToWin;
  }

  log(`Product: ${raceProduct}`);
};

const start = async (file: string) => {
  const content = fs.readFileSync(path.join(__dirname, file), 'utf8');

  //const races: Race[] = parseInputPart1(content);
  const races: Race[] = parseInputPart2(content);

  log(races);
  run(races);
};

//start('./files/example.txt');
start('./files/input.txt');
