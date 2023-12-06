import { EOL } from 'os';
import { Operation, Operator } from './types';

export const parseInput = (input: string): Operation[] => {
  return input.split(EOL).map((line, id) => {
    return {
      id,
      operator: line.substring(0, 3) as Operator,
      operand: parseInt(line.substring(3).replace('+', '').trim()),
    };
  });
};
