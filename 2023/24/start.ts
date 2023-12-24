import fs from 'fs';
import path from 'path';
import { parseInputPart1 } from './utils';
import findIntersection from '@utils/findIntersection';

const debugMode = false;
const debug = (...params: any[]) => debugMode && console.log(...params);
const log = (...params: any[]) => console.log(...params);

const start = async (file: string, boundMin: number, boundMax: number) => {
  const content = fs.readFileSync(path.join(__dirname, file), 'utf8');
  const hailstones = parseInputPart1(content);

  //log(hailstones);

  const t = 1000000000000000;
  for (const hailstone of hailstones) {
    // Scale the vectors
    hailstone.vector.x *= t;
    hailstone.vector.y *= t;
  }

  let intersecting = 0;

  for (let h1 = 0; h1 < hailstones.length; h1++) {
    for (let h2 = h1 + 1; h2 < hailstones.length; h2++) {
      const hailstone1 = hailstones[h1];
      const hailstone2 = hailstones[h2];

      const result = findIntersection(hailstone1, hailstone2);
      if (
        result.type === 'intersecting' &&
        result.point!.x >= boundMin &&
        result.point!.x <= boundMax &&
        result.point!.y >= boundMin &&
        result.point!.y <= boundMax
      ) {
        intersecting++;
      }
    }
  }

  log(intersecting);
};

//start('./files/example.txt', 7, 27);
start('./files/input.txt', 200000000000000, 400000000000000);
