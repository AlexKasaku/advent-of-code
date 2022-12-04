import range from './range';

describe('range', () => {
  it.each([
    [1, 1, [1]],
    [1, 3, [1, 2, 3]],
    [-3, -1, [-3, -2, -1]],
    [-2, 2, [-2, -1, 0, 1, 2]],
    [8, 12, [8, 9, 10, 11, 12]],
  ])('works', (start, end, expected) => {
    expect(range(start, end)).toEqual(expected);
  });
});
