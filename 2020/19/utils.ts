import { EOL } from 'os';

export const parseInput = (input: string) => {
  const sections = input.split(EOL + EOL);

  return {
    rules: new Map(
      sections[0].split(EOL).map((l) => {
        const parts = l.split(':');
        return [parseInt(parts[0]), parts[1].trim().replaceAll('"', '')];
      }),
    ),
    tests: sections[1].split(EOL),
  };
};
