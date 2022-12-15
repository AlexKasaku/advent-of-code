export type Point = { x: number; y: number };
export type SensorInfo = {
  sensor: Point;
  beacon: Point;
  distanceToBeacon: number;
};
export type Info = {
  sensors: SensorInfo[];
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
};
