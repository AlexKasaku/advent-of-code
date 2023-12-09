import buildPrimeArray from './buildPrimeArray';
import getPrimeFactors from './getPrimeFactors';

describe('getPrimeFactors', () => {
  const testCases = [
    [1, []],
    [2, [2]],
    [3, [3]],
    [4, [2]],
    [6, [2, 3]],
    [10, [2, 5]],
    [15015, [3, 5, 7, 11, 13]],
    [669384293, [29, 47, 61, 83, 97]],
  ];

  describe('without a prime map', () => {
    it.each(testCases as [number, number[]][])(
      'returns correct prime factors',
      (number: number, expected: number[]) => {
        expect(getPrimeFactors(number)).toEqual(expected);
      },
    );
  });

  describe('with a prime map', () => {
    const primeMap = buildPrimeArray(100);

    it.each(testCases as [number, number[]][])(
      'returns correct prime factors',
      (number: number, expected: number[]) => {
        expect(getPrimeFactors(number, primeMap)).toEqual(expected);
      },
    );
  });
});
