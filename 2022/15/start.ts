import fs from 'fs';
import { EOL } from 'os';
import path from 'path';
import { manhattanDistance, parseInput, pointToString } from './utils';

//const file = './files/example.txt';
const file = './files/input.txt';

const start = async () => {
  const content = fs.readFileSync(path.join(__dirname, file), 'utf8');

  const info = parseInput(content);

  // Example
  //const searchSize = 20;

  // Input
  const searchSize = 4000000;

  const startX = 0;
  const startY = 0;

  const startTime = performance.now();

  for (let x = startX; x <= searchSize; x++) {
    let y = startY;
    while (y <= searchSize) {
      const currentPoint = { x, y };

      //console.log(`Checking ${x},${y}`);

      const inSensorRange = info.sensors.find(
        (i) => manhattanDistance(currentPoint, i.sensor) <= i.distanceToBeacon,
      );

      if (inSensorRange) {
        // We are in range of a sensor, skip Y until we're on the other side of it
        //console.log(inSensorRange);
        const yDistance =
          inSensorRange.distanceToBeacon -
          Math.abs(inSensorRange.sensor.x - x) +
          (inSensorRange.sensor.y - y);

        // yDistance moves us to the edge of the sensor boundary, then move one more spot to
        // check the next spot
        y += yDistance + 1;
      } else {
        console.log(currentPoint);
        console.log(currentPoint.x * 4000000 + currentPoint.y);
        console.log(
          `Search took ${performance.now() - startTime} milliseconds`,
        );

        return;
      }
    }
  }
};

start();
