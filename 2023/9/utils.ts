import { EOL } from 'os';

export const parseInput = (input: string) => {
  return input.split(EOL).map((line) => line.split(' ').map(Number));
};
