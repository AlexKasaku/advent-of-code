import { EOL } from 'os';
import { Snafu } from './types';

export const parseInput = (input: string): Snafu[] => {
  return input.split(EOL);
};

const getSnafuCharValue = (snafuChar: string): number => {
  switch (snafuChar) {
    case '=':
      return -2;
    case '-':
      return -1;
  }
  return parseInt(snafuChar);
};

export const snafuToInt = (snafu: Snafu): number =>
  snafu
    .split('')
    .reverse()
    .reduce((total, current, index) => {
      const multiplyer = Math.pow(5, index);

      return total + getSnafuCharValue(current) * multiplyer;
    }, 0);

export const intToSnafu = (value: number): Snafu => {
  let base5 = '0' + value.toString(5);
  let converted = Array.from(base5, Number)
    .reverse()
    .map((value, index, array) => {
      if (value >= 3) array[index + 1]++;
      return '012=-'[value % 5];
    })
    .reverse()
    .join('');

  if (converted[0] == '0') {
    converted = converted.substring(1);
  }
  return converted;
};
