import { EOL } from 'os';
import { PasswordTest } from './types';

export const parseInput = (input: string): PasswordTest[] => {
  return input.split(EOL).map((line) => {
    // 1-3 b: cdefg
    const regex = /(\d+)-(\d+) ([a-z]): ([a-z]+)/;
    const matches = line.match(regex)!;

    return {
      range: { low: parseInt(matches[1]), high: parseInt(matches[2]) },
      char: matches[3],
      password: matches[4],
    };
  });
};
