import fs from 'fs';
import path from 'path';
import { parseInput } from './utils';

const debugMode = false;
const debug = (...params: any[]) => debugMode && console.log(...params);
const log = (...params: any[]) => console.log(...params);

const start = async (file: string) => {
  const content = fs.readFileSync(path.join(__dirname, file), 'utf8');

  const ticketInfo = parseInput(content);

  // Part 1 - Find invalid
  let invalidTotal = 0;

  for (const ticket of ticketInfo.otherTickets) {
    for (const value of ticket) {
      let valid = false;
      for (const rule of ticketInfo.rules) {
        for (const range of rule.validRanges) {
          if (value >= range.low && value <= range.high) {
            valid = true;
            break;
          }
        }
        if (valid) break;
      }
      if (!valid) {
        invalidTotal += value;
      }
    }
  }

  log(invalidTotal);
};

//start('./files/example.txt');
start('./files/input.txt');
