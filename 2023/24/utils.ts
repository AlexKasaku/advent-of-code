import { PointAndVector } from '@utils/findIntersection';
import { EOL } from 'os';

export const parseInputPart1 = (input: string): PointAndVector[] => {
  return input.split(EOL).map((line) => {
    // 12, 31, 28 @ -1, -2, -1
    const regex = /(\d+),\s+(\d+),\s+(\d+)\s+@\s+(-?\d+),\s+(-?\d+),\s+(-?\d+)/;
    const match = line.match(regex);
    if (!match) throw 'Could not parse line: ' + line;

    // For part 1 we are only using x + y
    return {
      point: { x: parseInt(match[1]), y: parseInt(match[2]) },
      vector: { x: parseInt(match[4]), y: parseInt(match[5]) },
    };
  });
};
