import fs from 'fs';
import path from 'path';
import { parseInput } from './utils';
import { PasswordTest } from './types';

const debugMode = false;
const debug = (...params: any[]) => debugMode && console.log(...params);
const log = (...params: any[]) => console.log(...params);

const part1 = (passwordTests: PasswordTest[]) => {
  let validPasswords = 0;

  for (const { range, char, password } of passwordTests) {
    const appearances = [...password].filter((c) => c === char).length;
    if (appearances >= range.low && appearances <= range.high) validPasswords++;
  }

  log(`Valid passwords: ${validPasswords}`);
};

const part2 = (passwordTests: PasswordTest[]) => {
  let validPasswords = 0;

  for (const { range, char, password } of passwordTests) {
    const firstCharValid = password[range.low - 1] === char;
    const secondCharValid = password[range.high - 1] === char;

    if (
      (firstCharValid || secondCharValid) &&
      !(firstCharValid && secondCharValid)
    )
      validPasswords++;
  }

  log(`Valid passwords: ${validPasswords}`);
};

const start = async (file: string) => {
  const content = fs.readFileSync(path.join(__dirname, file), 'utf8');

  const passwordTests = parseInput(content);

  //part1(passwordTests);
  part2(passwordTests);
};

//start('./files/example.txt');
start('./files/input.txt');
