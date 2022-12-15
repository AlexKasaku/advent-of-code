import { byAscending, byDescending } from '@utils/sort';
import { EOL } from 'os';
import { Info, Point, SensorInfo } from './types';

export const manhattanDistance = (a: Point, b: Point) =>
  Math.abs(a.x - b.x) + Math.abs(a.y - b.y);

export const pointToString = ({ x, y }: Point) => `x${x}y${y}`;

export const parseInput = (input: string): Info => {
  const sensors: SensorInfo[] = input.split(EOL).map((line) => {
    const lineRegex =
      /.*x=(?<sensorX>-?\d+), y=(?<sensorY>-?\d+): closest beacon is at x=(?<beaconX>-?\d+), y=(?<beaconY>-?\d+)/gi;
    const match = lineRegex.exec(line);

    if (!match || !match.groups)
      throw 'Could not parse input for line: ' + line;

    const { sensorX, sensorY, beaconX, beaconY } = match.groups;

    const info = {
      sensor: { x: parseInt(sensorX), y: parseInt(sensorY) },
      beacon: { x: parseInt(beaconX), y: parseInt(beaconY) },
      distanceToBeacon: 0,
    };
    info.distanceToBeacon = manhattanDistance(info.sensor, info.beacon);
    return info;
  });

  // Could store min/max coords as we go, but there are not very many inputs so
  // this will do.

  return {
    sensors,
    minX: sensors
      .map((i) => Math.min(i.sensor.x, i.beacon.x))
      .sort(byAscending)[0],
    maxX: sensors
      .map((i) => Math.max(i.sensor.x, i.beacon.x))
      .sort(byDescending)[0],
    minY: sensors
      .map((i) => Math.min(i.sensor.y, i.beacon.y))
      .sort(byAscending)[0],
    maxY: sensors
      .map((i) => Math.max(i.sensor.y, i.beacon.y))
      .sort(byDescending)[0],
  };
};
