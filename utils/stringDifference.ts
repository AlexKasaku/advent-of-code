const stringDifference = (one: string, two: string): string =>
  [...new Set(one)].filter((x) => ![...new Set(two)].includes(x)).join('');

export default stringDifference;
