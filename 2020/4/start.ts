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

const part2 = (passports: Passport[]) => {
  const validPassports = passports
    .map((passport) => {
      const hasAllKeys = requiredKeys.every(
        (key) => passport[key] !== undefined,
      );

      if (!hasAllKeys) return false;

      // byr
      const byr = parseInt(passport.byr!);
      if (byr < 1920 || byr > 2002) return false;

      // iyr
      const iyr = parseInt(passport.iyr!);
      if (iyr < 2010 || iyr > 2020) return false;

      // eyr
      const eyr = parseInt(passport.eyr!);
      if (eyr < 2020 || eyr > 2030) return false;

      // hgt
      const hgt = parseInt(
        passport.hgt!.substring(0, passport.hgt!.length - 2),
      );
      if (passport.hgt!.endsWith('cm')) {
        if (hgt < 150 || hgt > 193) return false;
      } else {
        if (hgt < 59 || hgt > 76) return false;
      }

      // hcl
      if (!passport.hcl!.match(/#[a-z0-9]{6}/)) return false;

      // ecl
      if (
        ['amb', 'blu', 'brn', 'gry', 'grn', 'hzl', 'oth'].indexOf(
          passport.ecl!,
        ) === -1
      )
        return false;

      // pid
      if (passport.pid?.length != 9 || Number.isNaN(parseInt(passport.pid!)))
        return false;

      return true;
    })
    .map((valid) => (valid ? 1 : (0 as number)))
    .reduce(toSum);

  log(`Valid passports: ${validPassports}`);
};

const start = async (file: string) => {
  const content = fs.readFileSync(path.join(__dirname, file), 'utf8');

  const passports = parseInput(content);

  //part1(passports);
  part2(passports);
};

//start('./files/example.txt');
//start('./files/example.valid.txt');
//start('./files/example.invalid.txt');
start('./files/input.txt');
