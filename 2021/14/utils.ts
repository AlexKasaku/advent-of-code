import { EOL } from 'os';
import { InsertionMap } from './types';

export const parseInput = (input: string): [string, InsertionMap] => {
  const lines = input.split(EOL);
  const template = lines[0];

  const insertionMap = new Map<string, string[]>(
    lines.slice(2).map((line) => {
      const [part1, part2] = line.split(' -> ');
      return [part1, [part1[0] + part2, part2 + part1[1]]];
    })
  );

  return [template, insertionMap];
};
