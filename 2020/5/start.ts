import fs from 'fs';
import path from 'path';
import { parseInput } from './utils';

const debugMode = true;
const debug = (...params: any[]) => debugMode && console.log(...params);
const log = (...params: any[]) => console.log(...params);

const start = async (file: string) => {
  const content = fs.readFileSync(path.join(__dirname, file), 'utf8');

  const seats = parseInput(content);

  // Part 1
  let highest = 0;
  for (const seat of seats) {
    const row = parseInt(
      seat.substring(0, 7).replaceAll('B', '1').replaceAll('F', '0'),
      2,
    );
    const column = parseInt(
      seat.substring(7).replaceAll('R', '1').replaceAll('L', '0'),
      2,
    );
    const seatId = row * 8 + column;
    debug(`${seat}: row ${row}, column ${column}, seat ID ${seatId}`);

    if (seatId > highest) highest = seatId;
  }

  log(highest);
};

//start('./files/example.txt');
start('./files/input.txt');
