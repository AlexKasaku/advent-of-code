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
  ])('works with default comparer', (values: any[], expected) => {
    expect(values.reduce(groupByDuplicate(), [] as any)).toEqual(expected);
  });

  type Obj = { x: number; y: number };

  it.each([
    [
      [
        { x: 1, y: 1 },
        { x: 1, y: 4 },
        { x: 2, y: 3 },
        { x: 3, y: 3 },
      ],
      [
        [
          { x: 1, y: 1 },
          { x: 1, y: 4 },
        ],
        [
          { x: 2, y: 3 },
          { x: 3, y: 3 },
        ],
      ],
    ],
  ])('works with custom comparer', (values: Obj[], expected) => {
    expect(
      values.reduce(
        groupByDuplicate((a, b) => a.x == b.x || a.y == b.y),
        [] as any
      )
    ).toEqual(expected);
  });
});
