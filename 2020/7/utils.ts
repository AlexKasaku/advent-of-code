import { EOL } from 'os';
import { BagConfiguration, BagContents } from './types';

export const parseInput = (input: string): BagConfiguration => {
  return new Map<string, BagContents>(
    input.split(EOL).map((line) => {
      const bagType = line.match(/^([a-z ]+) bags contain/)![1];
      const restOfLine = line.substring(bagType.length);

      const bags = [...restOfLine.matchAll(/(\d+) ([a-z ]+) bag/g)];
      const bagCollection = [...bags].map((b) => ({
        type: b[2],
        count: parseInt(b[1]),
      }));

      return [bagType, bagCollection];
    }),
  );
};
