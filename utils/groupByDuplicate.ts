import isEqual from 'lodash/isEqual';

type EqualityComparer<T> = (value: T, other: T) => boolean;

// Note that by defaul this uses the isEqual from lodash to determine equality, which can impact performance.
const groupByDuplicate =
  <T>(equalityComparer: EqualityComparer<T> = isEqual) =>
  (acc: T[][], item: T, index: number) => {
    const existing = acc.find((x) => equalityComparer(x[0], item));
    if (existing) existing.push(item);
    else acc.push([item]);
    return acc;
  };

export default groupByDuplicate;
