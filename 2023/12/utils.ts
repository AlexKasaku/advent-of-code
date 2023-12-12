import { EOL } from 'os';
import { Row } from './types';

export const parseInput = (input: string): Row[] => {
  return input.split(EOL).map((line) => {
    const parts = line.split(' ');

    return {
      pattern: parts[0],
      groups: parts[1].split(',').map(Number),
    };
  });
};

type WorkInProgress = {
  remainingGroups: number[];
  remainingPatternLength: number;
  position: number;
  indexes: number[];
};

const toLengthForGroups = (a: number, b: number) => a + b + 1;

export const buildPatternIndexCombinations = ({
  pattern,
  groups,
}: Row): number[][] => {
  const combinations: number[][] = [];

  // For length of string, work out the different ways of placing the groups.

  // Build as an array of indexes for starting positions. The indexes combined with
  // groups must never go more than the pattern length;
  const comboStack: WorkInProgress[] = [
    {
      remainingGroups: [...groups],
      remainingPatternLength: pattern.length,
      position: 0,
      indexes: [],
    },
  ];

  while (comboStack.length > 0) {
    const currentCombo = comboStack.shift()!;
    //console.log(currentCombo);

    if (currentCombo.remainingGroups.length > 0) {
      // Find all placements for next group that leave enough remaining pattern length
      const nextGroup = [...currentCombo.remainingGroups].shift()!;
      const remainingGroups = [...currentCombo.remainingGroups].slice(1);

      // How much space we need to leave to account for remaining groups
      const lengthRequiredForRemaining =
        remainingGroups.length > 0
          ? remainingGroups.reduce(toLengthForGroups)
          : 0;

      // How much space we need to fill with our placements
      const lengthRequiredToFill =
        currentCombo.remainingPatternLength - lengthRequiredForRemaining;

      // Work out how many index positions there can be for this group. Count the group
      // as one bigger than it is to account for the space needed after it, IF there are still groups remaining
      const placements =
        lengthRequiredToFill +
        1 -
        (nextGroup + (remainingGroups.length > 0 ? 1 : 0));

      // Some debug statements
      // console.log(`This group size: ${nextGroup}.`);
      // console.log(
      //   `Length required for remaining: ${lengthRequiredForRemaining}`,
      // );
      // console.log(`Length required to fill: ${lengthRequiredToFill}.`);
      // console.log(`Placements: ${placements}.`);

      for (let index = 0; index < placements; index++) {
        comboStack.push({
          remainingGroups: remainingGroups,
          remainingPatternLength:
            currentCombo.remainingPatternLength - (nextGroup + index) - 1,
          indexes: [...currentCombo.indexes, currentCombo.position + index],
          position: currentCombo.position + index + nextGroup + 1,
        });
      }
    } else {
      // This combo is finished! Add it to the valid combos
      combinations.push(currentCombo.indexes);
    }
  }

  return combinations;
};

export const isValidForRow = ({ pattern, groups }: Row, indexes: number[]) => {
  // We have a possible index combination, now determine if it fits the pattern

  // Use groups + indexes to create a string
  const asArray = [...new Array(pattern.length)].fill(false);

  for (let groupIndex = 0; groupIndex < groups.length; groupIndex++) {
    const group = groups[groupIndex];
    const position = indexes[groupIndex];

    for (let index = 0; index < group; index++) {
      asArray[position + index] = true;
    }
  }

  const asString = asArray.map((b) => (b ? '#' : '.')).join('');

  // Now work out if the string is valid for this pattern
  for (let patternIndex = 0; patternIndex < pattern.length; patternIndex++) {
    if (
      (pattern[patternIndex] === '#' || pattern[patternIndex] === '.') &&
      pattern[patternIndex] !== asString[patternIndex]
    )
      return false;
  }

  return true;
};
