import fs from 'fs';
import path from 'path';
import { parseInput } from './utils';
import { createAndInitArray, createArray } from '@utils/createArray';

const debugMode = true;
const debug = (...params: any[]) => debugMode && console.log(...params);
const log = (...params: any[]) => console.log(...params);

const start = async (file: string) => {
  const content = fs.readFileSync(path.join(__dirname, file), 'utf8');

  const seats = parseInput(content);

  let highest = 0;
  const seatPlan = createAndInitArray(() => null, 128, 8) as (
    | number
    | null
  )[][];

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
    seatPlan[row][column] = seatId;

    if (seatId > highest) highest = seatId;
  }

  // Part 2, find rows with some emtpy seats:
  const rowsWithSeats = seatPlan.filter(
    (row) => !row.every((c) => c === null) && row.some((c) => c === null),
  );

  console.dir(rowsWithSeats, { depth: null });

  log(highest);
};

//start('./files/example.txt');
start('./files/input.txt');
