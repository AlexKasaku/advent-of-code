import groupByDuplicate from './groupByDuplicate';

describe('groupByDuplicate', () => {
  it.each([
    [
      [1, 2, 2, 3, 3, 3],
      [[1], [2, 2], [3, 3, 3]],
    ],
    [
      [{ x: 1 }, { x: 2 }, { x: 2 }],
      [[{ x: 1 }], [{ x: 2 }, { x: 2 }]],
    ],
    [
      [
        { x: 1, y: 1 },
        { x: 2, y: 1 },
        { x: 2, y: 2 },
      ],
      [[{ x: 1, y: 1 }], [{ x: 2, y: 1 }], [{ x: 2, y: 2 }]],
    ],
  ])('works', (values: any[], expected) => {
    expect(values.reduce(groupByDuplicate, [] as any)).toEqual(expected);
  });
});
