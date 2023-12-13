import { calculateExpression } from './utils';

describe('caculateExpression', () => {
  describe('processing in regular order', () => {
    it.each([
      ['1 + 1', 2],
      ['2 * 2', 4],
      ['1 + 7 * 2', 16],
      ['2 * 7 + 1', 15],
    ])(
      'for expression %p returns the correct value of %p',
      (expression, expected) => {
        expect(calculateExpression(expression)).toEqual(expected);
      },
    );
  });

  describe('processing additions first', () => {
    it.each([
      ['1 + 1', 2],
      ['2 * 2', 4],
      ['1 + 7 * 2', 16],
      ['2 * 7 + 1', 16],
    ])(
      'for expression %p returns the correct value of %p',
      (expression, expected) => {
        expect(calculateExpression(expression, true)).toEqual(expected);
      },
    );
  });
});
