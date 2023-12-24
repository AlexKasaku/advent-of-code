export type Point = {
  x: number;
  y: number;
};

export type Vector = {
  x: number;
  y: number;
};

export type PointAndVector = {
  point: Point;
  vector: Vector;
};

export type Point3D = {
  x: number;
  y: number;
  z: number;
};

export type Vector3D = {
  x: number;
  y: number;
  z: number;
};

export type PointAndVector3D = {
  point: Point3D;
  vector: Vector3D;
};

export const crossProduct = (v: Point, w: Point): number =>
  v.x * w.y - v.y * w.x;
export const dotProduct = (v: Point, w: Point): number => v.x * w.x + v.y * w.y;
export const subtractPoints = (v: Point, w: Point): Point => ({
  x: v.x - w.x,
  y: v.y - w.y,
});
export const addPoints = (v: Point, w: Point): Point => ({
  x: v.x + w.x,
  y: v.y + w.y,
});

// export const crossProduct3D = (v: Point, w: Point): number =>
//   v.x * w.y - v.y * w.x;
// export const dotProduct3D = (v: Point, w: Point): number => v.x * w.x + v.y * w.y;
export const subtractPoints3D = (v: Point3D, w: Point3D): Point3D => ({
  x: v.x - w.x,
  y: v.y - w.y,
  z: v.z - w.z,
});
export const addPoints3D = (v: Point3D, w: Point3D): Point3D => ({
  x: v.x + w.x,
  y: v.y + w.y,
  z: v.z + w.z,
});
