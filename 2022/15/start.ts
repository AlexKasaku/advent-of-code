import fs from 'fs';
import { EOL } from 'os';
import path from 'path';
import { manhattanDistance, parseInput, pointToString } from './utils';

//const file = './files/example.txt';
const file = './files/input.txt';

const start = async () => {
  const content = fs.readFileSync(path.join(__dirname, file), 'utf8');

  const info = parseInput(content);

  console.log(info);

  // Create set of sensors + beacons
  const sensors = new Set<string>(
    info.sensors.map((s) => pointToString(s.sensor))
  );
  const beacons = new Set<string>(
    info.sensors.map((s) => pointToString(s.beacon))
  );

  // Part 1

  // Walk from minX to maxY for Y, allow a buffer
  let points = 0;

  // Example
  //const y = 10;

  // Input
  const y = 2000000;

  for (let x = info.minX - 5000000; x < info.maxX + 5000000; x++) {
    const currentPoint = { x, y };
    const pointAsString = pointToString(currentPoint);

    if (sensors.has(pointAsString) || beacons.has(pointAsString)) continue;

    const inSensorRange = info.sensors.find(
      (i) => manhattanDistance(currentPoint, i.sensor) <= i.distanceToBeacon
    );

    if (!inSensorRange) continue;

    points++;
  }
  console.log(points);
};

start();
