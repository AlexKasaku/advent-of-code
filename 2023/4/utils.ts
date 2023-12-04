import { EOL } from 'os';
import { Round } from './types';

export const parseInput = (input: string): Round[] => {
  return input.split(EOL).map((line) => {
    const parts = line.split(':');
    const id = parseInt(parts[0].substring(4));

    const numberParts = parts[1].split('|');

    const winningNumbers = numberParts[0]
      .trim()
      .split(' ')
      .filter((e) => e != '')
      .map((e) => parseInt(e.trim()));
    const numbers = numberParts[1]
      .trim()
      .split(' ')
      .filter((e) => e != '')
      .map((e) => parseInt(e.trim()));

    return {
      id,
      winningNumbers,
      numbers,
    };
  });
};
