import { EOL } from 'os';
import { Passport, ValidKey } from './types';

export const parseInput = (input: string): Passport[] => {
  return input.split(EOL + EOL).map((lines) => {
    const passport: Passport = {};

    lines
      .split(EOL)
      .flatMap((line) => line.split(' '))
      .map((entry) => {
        const parts = entry.split(':');

        passport[parts[0] as ValidKey] = parts[1];
      });

    return passport;
  });
};
