import findIntersection, { PointAndVector } from './findIntersection';

describe('findIntersection', () => {
  it('finds intersection', () => {
    const pv1: PointAndVector = {
      point: { x: 0, y: 0 },
      vector: { x: 10, y: 10 },
    };
    const pv2: PointAndVector = {
      point: { x: 0, y: 10 },
      vector: { x: -10, y: 10 },
    };

    const result = findIntersection(pv1, pv2);

    expect(result.type).toEqual('intersecting');

    if (result.type === 'intersecting') {
      expect(result.point.x).toEqual(5);
      expect(result.point.y).toEqual(5);
    }
  });
});
