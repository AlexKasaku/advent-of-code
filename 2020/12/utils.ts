import { EOL } from 'os';
import { Command, Instruction } from './types';

export const parseInput = (input: string): Instruction[] => {
  return input.split(EOL).map((line) => ({
    command: line[0] as Command,
    value: parseInt(line.substring(1)),
  }));
};
