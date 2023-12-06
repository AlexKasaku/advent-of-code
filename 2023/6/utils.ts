import { EOL } from 'os';
import { Race } from './types';

export const parseInputPart1 = (input: string): Race[] => {
  const lines = input.split(EOL);

  const lineToNumbers = (line: string) =>
    line
      .trim()
      .split(' ')
      .filter((x) => x.trim() != '')
      .map((x) => parseInt(x));

  const times = lineToNumbers(lines[0].substring(5));
  const distances = lineToNumbers(lines[1].substring(9));

  return times.map((t, i) => ({ time: t, distance: distances[i] }));
};

export const parseInputPart2 = (input: string): Race[] => {
  const lines = input.split(EOL);

  const stripNonDigits = (line: string) =>
    parseInt(line.replaceAll(/[^\d]/g, ''));

  return [
    { time: stripNonDigits(lines[0]), distance: stripNonDigits(lines[1]) },
  ];
};
