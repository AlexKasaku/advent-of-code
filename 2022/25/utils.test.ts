import range from '@utils/range';
import { intToSnafu, snafuToInt } from './utils';

describe('snafuToInt', () => {
  test.each([
    ['1=-0-2', 1747],
    ['12111', 906],
    ['2=0=', 198],
    ['21', 11],
    ['2=01', 201],
    ['111', 31],
    ['20012', 1257],
    ['112', 32],
    ['1=-1=', 353],
    ['1-12', 107],
    ['12', 7],
    ['1=', 3],
    ['122', 37],
  ])('%p -> %p', (snafu, expectedInt) => {
    expect(snafuToInt(snafu)).toEqual(expectedInt);
  });
});

describe('intToSnafu', () => {
  test.each([
    [1, '1'],
    [2, '2'],
    [3, '1='],
    [4, '1-'],
    [5, '10'],
    [6, '11'],
    [7, '12'],
    [8, '2='],
    [9, '2-'],
    [10, '20'],
    [15, '1=0'],
    [20, '1-0'],
    [2022, '1=11-2'],
    [12345, '1-0---0'],
    [314159265, '1121-1110-1=0'],
  ])('%p -> %p', (int, expectedSnafu) => {
    expect(intToSnafu(int)).toEqual(expectedSnafu);
  });
});

describe('snafuToInt with intToSnafu', () => {
  test.each(range(0, 1000))('work back and forth with %p', (startValue) => {
    expect(snafuToInt(intToSnafu(startValue))).toEqual(startValue);
  });
});
