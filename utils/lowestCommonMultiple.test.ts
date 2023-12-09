import lowestCommonMultiple from './lowestCommonMultiple';

describe('lowestCommonMultiple', () => {
  it.each([
    [[2, 3], 6],
    [[2, 4], 4],
    [[2, 5], 10],
    [[2, 7], 14],
    [[6, 7], 42],
    [[6, 14], 42],
    [[6, 14, 3, 2, 7], 42],
    [[2, 3, 5, 7, 11, 13], 30030],
  ])('for %p, returns %p', (numbers, expected) => {
    expect(lowestCommonMultiple(...numbers)).toEqual(expected);
  });
});
