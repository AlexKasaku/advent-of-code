import { compareLists, innerCompare } from './utils';

// describe('compareLists', () => {
//   describe('if both sides are integers', () => {
//     it('TRUE when left side is lower', () => {
//       expect(compareLists([1], [2])).toBeTruthy();
//     });
//     it('FALSE when right side is lower', () => {
//       expect(compareLists([2], [1])).toBeFalsy();
//     });
//     it('TRUE when first is same, but second is lower', () => {
//       expect(compareLists([1, 1], [1, 2])).toBeTruthy();
//     });
//     it('FALSE when first is same, but second is higher', () => {
//       expect(compareLists([1, 2], [1, 1])).toBeFalsy();
//     });
//   });

//   describe('if both sides are lists', () => {
//     it.each([
//       [[1], [2], true],
//       [[2], [1], false],
//       [[1, 1], [1, 2], true],
//       [[1, 2], [1, 3], true],
//       [[1, 2], [1, 1], false],
//     ])('Will compare each list item - %p - %p', (left, right, expected) => {
//       expect(compareLists([left], [right])).toEqual(expected);
//     });

//     it('TRUE if left list runs out of items', () => {
//       expect(compareLists([1], [1, 3])).toEqual(true);
//     });

//     it('TRUE if left list runs out of items but first number was lower for left', () => {
//       expect(compareLists([1], [2, 3])).toEqual(true);
//     });

//     it('FALSE if left list runs out of items but first number was higher for left', () => {
//       expect(compareLists([3], [2, 3])).toEqual(false);
//     });

//     it('FALSE if right list runs out of items', () => {
//       expect(compareLists([1, 1], [1])).toEqual(false);
//     });

//     it('TRUE if right list runs out of items but first number was lower for right', () => {
//       expect(compareLists([1, 3], [2])).toEqual(true);
//     });
//   });

//   it('misc tests', () => {
//     const isRight = (left: any, right: any) =>
//       expect(compareLists(left, right)).toEqual(true);
//     const isWrong = (left: any, right: any) =>
//       expect(compareLists(left, right)).toEqual(false);

//     isRight([6, 4, 3, 7], [6, 4, 3, 7, 0]);
//     isRight([6, 4, 3, 7, 0], [[6]]);
//     isRight([[6]], [[6, [], [4], [[3, 0, 9], [4, 9], [4, 4, 6], 0, 10], 9]]);

//     isRight(
//       [[2], [9, [[3, 7, 1], [2, 3, 4, 9], 3, 6, [1, 2, 9, 0, 4]], 8]],
//       [[2]]
//     );
//     isRight(
//       [[2]],
//       [
//         [2, [], 2],
//         [2, [5, [2, 2, 10, 2, 4], [3, 3, 5, 10], [6, 1]], [6, [6]], 2, 8],
//       ]
//     );
//   });
// });

describe('innerCompare', () => {
  it.each([
    [[[1], [2, 3, 4]], [1, [2, [3, [4, [5, 6, 0]]]], 8, 9], 1],
    [
      [1, [2, [3, [4, [5, 6, 0]]]], 8, 9],
      [1, [2, [3, [4, [5, 6, 7]]]], 8, 9],
      1,
    ],
    [[1, [2, [3, [4, [5, 6, 7]]]], 8, 9], [[1], 4], 1],
    [[1, [2, [3, [4, [5, 6, 0]]]], 8, 9], [[1], [2, 3, 4]], -1],
    [
      [1, [2, [3, [4, [5, 6, 7]]]], 8, 9],
      [1, [2, [3, [4, [5, 6, 0]]]], 8, 9],
      -1,
    ],
    [[[1], 4], [1, [2, [3, [4, [5, 6, 7]]]], 8, 9], -1],
  ])('compares %p to %p and returns %p', (left, right, expected) => {
    expect(innerCompare(left, right)).toEqual(expected);
  });
});
