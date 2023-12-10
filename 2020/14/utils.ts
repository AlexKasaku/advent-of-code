import { EOL } from 'os';
import { Command } from './types';

export const parseInput = (input: string): Command[] => {
  return input.split(EOL).map((line) => {
    if (line.startsWith('mask')) {
      return { type: 'mask', value: line.substring(7) };
    } else {
      const matches = line.match(/mem\[(\d+)\] = (\d+)$/)!;
      return {
        type: 'address',
        location: parseInt(matches[1]),
        value: parseInt(matches[2]),
      };
    }
  });
};
