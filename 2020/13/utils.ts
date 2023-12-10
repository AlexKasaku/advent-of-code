import { EOL } from 'os';
import { Setup } from './types';

export const parseInput = (input: string): Setup => {
  const lines = input.split(EOL);

  return {
    earliestDeparture: parseInt(lines[0]),
    busIds: lines[1].split(',').map((c) => (c === 'x' ? 'x' : parseInt(c))),
  };
};
