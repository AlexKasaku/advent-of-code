import isEqual from 'lodash/isEqual';

type EqualityComparer<T> = (value: T, other: T) => boolean;

/**
 * A reduction function generator (use with .reduce()) to group equal elements in an array together
 * @param equalityComparer A function for comparing equality of two elements. If not provided, by default this uses isEqual from lodash to determine equality, which can impact performance.
 * @returns A reduction function for performing the reduce
 */
const groupByDuplicate =
  <T>(equalityComparer: EqualityComparer<T> = isEqual) =>
  (acc: T[][], item: T, index: number) => {
    const existing = acc.find((x) => equalityComparer(x[0], item));
    if (existing) existing.push(item);
    else acc.push([item]);
    return acc;
  };

export default groupByDuplicate;
