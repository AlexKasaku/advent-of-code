import fs from 'fs';
import path from 'path';
import { getSeatsToFlip, parseInput } from './utils';
import { Grid } from '@utils/grid';
import { Space } from './types';

const debugMode = false;
const debug = (...params: any[]) => debugMode && console.log(...params);
const log = (...params: any[]) => console.log(...params);

const getSpaceChar = ({ isSeat, isOccupied }: Space) => {
  if (!isSeat) return '⬛';
  return isOccupied ? '🧑' : '🪑';
};

const renderGrid = (grid: Grid<Space>): void => {
  for (const row of grid.Values)
    console.log(row.reduce((a, b) => a + getSpaceChar(b), ''));
  console.log();
};

const start = async (file: string) => {
  const content = fs.readFileSync(path.join(__dirname, file), 'utf8');

  const seatPlan = parseInput(content);
  const isPart1 = false;
  renderGrid(seatPlan);

  let round = 0;
  while (true) {
    const seatsToFlip = getSeatsToFlip(seatPlan, isPart1);

    if (seatsToFlip.length === 0) break;

    log(`Flipping ${seatsToFlip.length} seats`);

    // Still got seats to flip, so not finished, flip 'em!
    seatsToFlip.forEach((s) => (s.isOccupied = !s.isOccupied));
    round++;

    //renderGrid(seatPlan);
  }

  const occupiedSeats = seatPlan.Values.flat().filter(
    (s) => s.isSeat && s.isOccupied,
  ).length;
  log(occupiedSeats);
};

//start('./files/example.txt');
start('./files/input.txt');
