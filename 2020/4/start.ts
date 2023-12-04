import fs from 'fs';
import path from 'path';
import { parseInput } from './utils';
import { Passport, requiredKeys } from './types';
import toSum from '@utils/toSum';

const debugMode = false;
const debug = (...params: any[]) => debugMode && console.log(...params);
const log = (...params: any[]) => console.log(...params);

const part1 = (passports: Passport[]) => {
  const validPassports = passports
    .map((passport) => {
      const isValid = requiredKeys.every((key) => passport[key] !== undefined);
      return (isValid ? 1 : 0) as number;
    })
    .reduce(toSum);

  log(`Valid passports: ${validPassports}`);
};
const start = async (file: string) => {
  const content = fs.readFileSync(path.join(__dirname, file), 'utf8');

  const passports = parseInput(content);

  log(passports);

  part1(passports);
};

//start('./files/example.txt');
start('./files/input.txt');
