import { List } from './types';

export const compareLists = (left: List, right: List, indent: number = 0) =>
  innerCompare(left, right, indent) > 0;

const debug = true;

export const innerCompare = (
  left: List,
  right: List,
  indent: number = 0
): number => {
  debugPair(indent, left, right);

  let leftX = 0;
  for (; leftX < left.length; leftX++) {
    const leftValue = left[leftX];
    const rightValue = right[leftX];

    // Left list has run out of values
    if (rightValue === undefined) {
      debugIndentOutput(indent, 'No right value when needed, returning -1');
      return -1;
    }

    // If both are integers
    if (isInteger(leftValue) && isInteger(rightValue)) {
      if (rightValue < leftValue) {
        debugIndentOutput(indent, 'Right value is lower');
        return -1;
      }
      if (rightValue > leftValue) return 1;
    } else {
      // One or both are lists, ensure both are lists and call again
      const leftList = !isInteger(leftValue) ? leftValue : [leftValue];
      const rightList = !isInteger(rightValue) ? rightValue : [rightValue];

      const compared = innerCompare(leftList, rightList, indent + 1);

      if (compared != 0) {
        debugIndentOutput(indent, 'Sublist comparison was ' + compared);
        return compared;
      }
    }
  }

  // In correct order if right still has items, otherwise we don't know.
  return right.slice(leftX).length > 0 ? 1 : 0;
};

const debugPair = (indent: number, left: List, right: List) => {
  debugIndentOutput(
    indent,
    `${JSON.stringify(left)} vs ${JSON.stringify(right)}`
  );
};

const debugIndentOutput = (indent: number, ...params: any): void => {
  if (!debug) return;
  [...Array(indent)].forEach(() => process.stdout.write('  '));
  console.log(...params);
};

const isInteger = (value: number | List): value is number =>
  typeof value === 'number';
