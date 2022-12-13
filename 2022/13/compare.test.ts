import { compareLists } from './start';

describe('compareLists', () => {
  describe('if both sides are integers', () => {
    it('TRUE when left side is lower', () => {
      expect(compareLists([1], [2])).toBeTruthy();
    });
    it('FALSE when right side is lower', () => {
      expect(compareLists([2], [1])).toBeFalsy();
    });
    it('TRUE when first is same, but second is lower', () => {
      expect(compareLists([1, 1], [1, 2])).toBeTruthy();
    });
    it('FALSE when first is same, but second is higher', () => {
      expect(compareLists([1, 2], [1, 1])).toBeFalsy();
    });
  });

  describe('if both sides are lists', () => {
    it.each([
      [[1], [2], true],
      [[2], [1], false],
      [[1, 1], [1, 2], true],
      [[1, 2], [1, 3], true],
      [[1, 2], [1, 1], false],
    ])('Will compare each list item - %p - %p', (left, right, expected) => {
      expect(compareLists([left], [right])).toEqual(expected);
    });

    it('TRUE if left list runs out of items', () => {
      expect(compareLists([1], [1, 3])).toEqual(true);
    });

    it('TRUE if left list runs out of items but first number was lower for left', () => {
      expect(compareLists([1], [2, 3])).toEqual(true);
    });

    it('FALSE if left list runs out of items but first number was higher for left', () => {
      expect(compareLists([3], [2, 3])).toEqual(false);
    });

    it('FALSE if right list runs out of items', () => {
      expect(compareLists([1, 1], [1])).toEqual(false);
    });

    it('TRUE if right list runs out of items but first number was lower for right', () => {
      expect(compareLists([1, 3], [2])).toEqual(true);
    });
  });
});
