import isEqual from 'lodash/isEqual';

const groupByDuplicate = <T>(acc: T[][], item: T, index: number) => {
  const existing = acc.find((x) => isEqual(x[0], item));
  if (existing) existing.push(item);
  else acc.push([item]);

  console.log(index);
  return acc;
};

export default groupByDuplicate;
