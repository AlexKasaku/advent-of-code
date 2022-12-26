import { EOL } from 'os';
import { MonkeyInput } from './types';

export const parseInput = (input: string): Map<string, MonkeyInput> => {
  const monkeys = input.split(EOL).map((line) => {
    const regex =
      /(?<name>\w+): (((?<left>\w+) (?<op>[=+\-\/*]) (?<right>\w+))|(?<value>\d+))/g;

    const match = regex.exec(line);

    if (!match || !match.groups)
      throw 'Could not parse input for line: ' + line;

    const { name, left, op, right, value } = match.groups;

    return {
      name,
      left,
      operation: op,
      right,
      value: value !== undefined ? parseInt(value) : undefined,
    };
  });
  return new Map<string, MonkeyInput>(monkeys.map((m) => [m.name, m]));
};
