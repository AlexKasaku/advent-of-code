import { byAscending, byDescending } from './sort';

describe('sort', () => {
  it.each([
    [
      [1, 2, 3],
      [1, 2, 3],
    ],
    [
      [1, 3, 2],
      [1, 2, 3],
    ],
    [
      [3, 1, 2],
      [1, 2, 3],
    ],
    [
      [3, 3, 2],
      [2, 3, 3],
    ],
    [
      [3, 2, 3],
      [2, 3, 3],
    ],
    [
      [3, 3, 3],
      [3, 3, 3],
    ],
    [
      [3, -1, 3],
      [-1, 3, 3],
    ],
    [
      [-1, 0, 0, 0, 1, 0],
      [-1, 0, 0, 0, 0, 1],
    ],
  ])(`correctly sorts %p into %p`, (values, expected) => {
    expect(values.sort(byAscending)).toEqual(expected);
    expect(values.sort(byDescending)).toEqual(expected.reverse());
  });
});
