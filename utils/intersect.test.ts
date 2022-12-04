import intersect from './intersect';

describe('intersect', () => {
  it.each([
    [[1], [2], []],
    [[1, 2], [3, 4], []],
    [[1, 2], [2, 3], [2]],
    [
      [1, 2, 3],
      [2, 3, 4],
      [2, 3],
    ],
    [[1], [1], [1]],
    [
      [1, 2],
      [1, 2],
      [1, 2],
    ],
    [
      [1, 2],
      [2, 1],
      [1, 2],
    ],
  ])('works', (a, b, expected) => {
    expect(intersect(a, b)).toEqual(expected);
  });
});
