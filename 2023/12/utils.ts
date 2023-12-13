import { EOL } from 'os';
import { Row } from './types';

export const parseInput = (input: string, unfold: boolean): Row[] => {
  return input.split(EOL).map((line) => {
    const parts = line.split(' ');

    const pattern = parts[0];
    const groups = parts[1].split(',').map(Number);

    if (!unfold)
      return {
        pattern,
        groups,
      };

    // Repeat pattern + groups 5 times
    return {
      pattern: [pattern, pattern, pattern, pattern, pattern].join('?'),
      groups: [groups, groups, groups, groups, groups].flat(),
    };
  });
};

const toLengthForGroups = (a: number, b: number) => a + b + 1;

// Store combinations for known pattern + group combos
const combinationCountCache = new Map<string, number>();
const createCacheKey = (pattern: string, groups: number[]) =>
  `${pattern}|${groups}`;

export const countPatternIndexCombinations = ({
  pattern,
  groups,
}: Row): number => {
  const cacheKey = createCacheKey(pattern, groups);
  const existingCount = combinationCountCache.get(cacheKey);

  if (existingCount !== undefined) return existingCount;

  // Find all placements for next group that leave enough remaining pattern length
  const firstGroup = [...groups].shift()!;
  const remainingGroups = [...groups].slice(1);

  // How much space we need to leave to account for remaining groups
  const lengthRequiredForRemaining =
    remainingGroups.length > 0 ? remainingGroups.reduce(toLengthForGroups) : 0;

  // How much space we need to fill with our placements
  const lengthRequiredToFill = pattern.length - lengthRequiredForRemaining;

  // Work out how many index positions there can be for this group. Count the group
  // as one bigger than it is to account for the space needed after it, IF there are still groups remaining
  const placements =
    lengthRequiredToFill +
    1 -
    (firstGroup + (remainingGroups.length > 0 ? 1 : 0));

  let combinationCount = 0;

  if (remainingGroups.length > 0) {
    // There are still remaining groups. For each valid placement of this group, add the combination count
    // for the remaining groups and pattern they will use

    for (let index = 0; index < placements; index++) {
      const testString = '.'.repeat(index) + '#'.repeat(firstGroup) + '.';

      if (isValidForStartOfPattern(pattern, testString)) {
        const remainingPattern = pattern.substring(index + firstGroup + 1);

        combinationCount += countPatternIndexCombinations({
          pattern: remainingPattern,
          groups: remainingGroups,
        });
      }
    }
  } else {
    // We don't have any remaining groups, so just find valid placements for this last group and return that.

    for (let index = 0; index < placements; index++) {
      const testString =
        '.'.repeat(index) +
        '#'.repeat(firstGroup) +
        '.'.repeat(pattern.length - index - firstGroup);

      if (isValidForStartOfPattern(pattern, testString)) {
        combinationCount++;
      }
    }
  }

  // Cache this combination count
  combinationCountCache.set(cacheKey, combinationCount);

  return combinationCount;
};

export const isValidForStartOfPattern = (
  pattern: string,
  newString: string,
) => {
  const patternToCheck = pattern.substring(0, newString.length);

  // Now work out if the string is valid for this pattern
  for (
    let patternIndex = 0;
    patternIndex < patternToCheck.length;
    patternIndex++
  ) {
    if (
      (patternToCheck[patternIndex] === '#' ||
        patternToCheck[patternIndex] === '.') &&
      patternToCheck[patternIndex] !== newString[patternIndex]
    )
      return false;
  }

  return true;
};
