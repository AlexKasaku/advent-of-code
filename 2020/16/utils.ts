import { EOL } from 'os';
import { TicketInfo } from './types';

export const parseInput = (input: string): TicketInfo => {
  const sections = input.split(EOL + EOL);

  const rules = sections[0].split(EOL).map((line) => {
    const matches = line.match(/([a-z ]+): (\d+)-(\d+) or (\d+)-(\d+)/)!;
    return {
      field: matches[1],
      validRanges: [
        { low: parseInt(matches[2]), high: parseInt(matches[3]) },
        { low: parseInt(matches[4]), high: parseInt(matches[5]) },
      ],
    };
  });

  const myTicket = sections[1].split(EOL)[1].split(',').map(Number);

  const otherTickets = sections[2]
    .split(EOL)
    .slice(1)
    .map((l) => l.split(',').map(Number));

  return { rules, myTicket, otherTickets };
};
