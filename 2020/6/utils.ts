import { EOL } from 'os';
import { Answers } from './types';

export const parseInput = (input: string): Answers[] => {
  const group = input.split(EOL + EOL);

  return group.map((g) => g.split(EOL));
};
