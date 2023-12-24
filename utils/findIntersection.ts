import {
  Point,
  PointAndVector,
  addPoints,
  crossProduct,
  subtractPoints,
} from './point';

export type IntersectionResult =
  | {
      type: 'colinear' | 'parallel' | 'non-intersecting';
    }
  | { type: 'intersecting'; point: Point };

// https://stackoverflow.com/questions/563198/how-do-you-detect-where-two-line-segments-intersect/565282#565282
const findIntersection = (
  p: PointAndVector,
  q: PointAndVector,
): IntersectionResult => {
  // r is defined as p.vector
  // s is defined as q.vector

  const rs = crossProduct(p.vector, q.vector);
  const qpr = crossProduct(subtractPoints(q.point, p.point), p.vector);

  if (rs === 0 && qpr === 0) {
    // Lines are colinear. We can expand this case if we need to to determine
    // if they are disjoint or overlapping
    return { type: 'colinear' };
  }
  if (rs === 0 && qpr !== 0) {
    return { type: 'parallel' };
  }
  if (rs !== 0) {
    // t = (q − p) × s / (r × s)
    const t =
      crossProduct(subtractPoints(q.point, p.point), q.vector) /
      crossProduct(p.vector, q.vector);
    // u = (q − p) × r / (r × s)
    const u =
      crossProduct(subtractPoints(q.point, p.point), p.vector) /
      crossProduct(p.vector, q.vector);

    if (t >= 0 && t <= 1 && u >= 0 && u <= 1) {
      // Intersection

      // Scaled vector
      const tr = { x: p.vector.x * t, y: p.vector.y * t };

      return { type: 'intersecting', point: addPoints(p.point, tr) };
    }
  }
  return { type: 'non-intersecting' };
};

export default findIntersection;
