import { EOL } from 'os';
import { InsertionMap } from './types';

export const parseInput = (input: string): [string, InsertionMap] => {
  const lines = input.split(EOL);
  const template = lines[0];

  const insertionMap = new Map<string, string>(
    lines.slice(2).map((line) => line.split(' -> ') as [string, string])
  );

  return [template, insertionMap];
};
