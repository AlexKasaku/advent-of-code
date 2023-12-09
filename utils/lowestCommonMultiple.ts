import greatestCommonDivsor from './greatestCommonDivisor';

const lowestCommonMultipleOfTwo = (a: number, b: number) =>
  (a / greatestCommonDivsor(a, b)) * b;

const lowestCommonMultiple = (...numbers: number[]) =>
  numbers.reduce(lowestCommonMultipleOfTwo, 1);

export default lowestCommonMultiple;
