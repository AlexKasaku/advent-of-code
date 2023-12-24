import fs from 'fs';
import path from 'path';
import { parseInputPart1 } from './utils';
import { init } from 'z3-solver';
import intersect from '@utils/intersect';
import { PointAndVector3D } from '../../utils/point';
import findIntersection from '@utils/findIntersection';

const debugMode = false;
const debug = (...params: any[]) => debugMode && console.log(...params);
const log = (...params: any[]) => console.log(...params);

const findRockVelocity = (
  hailstones: PointAndVector3D[],
): { vx: number; vy: number; vz: number } => {
  let xVelocities = undefined;
  let yVelocities = undefined;
  let zVelocities = undefined;

  // Determine rock velocity by finding pairs of hailstones that have the same velocity
  // along a given axis. The relative velocity of the rock to the hailstone in this axis
  // must be a divisor of the point difference of those hailstones. This will give us several
  // possible values, but if we apply this to all the pairs we can hopefully narrow down to
  // a single value.
  // This only works because the input set has these duplicates in!
  for (let h1Index = 0; h1Index < hailstones.length; h1Index++) {
    const h1 = hailstones[h1Index];
    for (let h2Index = h1Index + 1; h2Index < hailstones.length; h2Index++) {
      const h2 = hailstones[h2Index];

      if (h1.vector.x === h2.vector.x) {
        const velocityCandidates = new Set<number>();
        for (let vTest = -500; vTest < 500; vTest++) {
          if (Math.abs(h2.point.x - h1.point.x) % (vTest - h1.vector.x) == 0) {
            velocityCandidates.add(vTest);
          }
        }
        xVelocities =
          xVelocities !== undefined
            ? new Set<number>(
                intersect([...xVelocities], [...velocityCandidates]),
              )
            : new Set<number>(velocityCandidates);
      }

      if (h1.vector.y === h2.vector.y) {
        const velocityCandidates = new Set<number>();
        for (let vTest = -500; vTest < 500; vTest++) {
          if (Math.abs(h2.point.y - h1.point.y) % (vTest - h1.vector.y) == 0) {
            velocityCandidates.add(vTest);
          }
        }
        yVelocities =
          yVelocities !== undefined
            ? new Set<number>(
                intersect([...yVelocities], [...velocityCandidates]),
              )
            : new Set<number>(velocityCandidates);
      }

      if (h1.vector.z === h2.vector.z) {
        const velocityCandidates = new Set<number>();
        for (let vTest = -500; vTest < 500; vTest++) {
          if (Math.abs(h2.point.z - h1.point.z) % (vTest - h1.vector.z) == 0) {
            velocityCandidates.add(vTest);
          }
        }
        zVelocities =
          zVelocities !== undefined
            ? new Set<number>(
                intersect([...zVelocities], [...velocityCandidates]),
              )
            : new Set<number>(velocityCandidates);
      }
    }
  }

  if (xVelocities!.size > 1 || yVelocities!.size > 1 || zVelocities!.size > 1)
    throw 'Could not determine velocities';

  return {
    vx: [...xVelocities!.values()][0],
    vy: [...yVelocities!.values()][0],
    vz: [...zVelocities!.values()][0],
  };
};

const start = async (file: string, boundMin: number, boundMax: number) => {
  const content = fs.readFileSync(path.join(__dirname, file), 'utf8');
  const hailstones = parseInputPart1(content);

  const { vx, vy, vz } = findRockVelocity(hailstones);

  // Now we need to find the origin point. We can do this using two hailstone
  // paths with the velocities adjusted so they are relatve to the rock (and the rock
  // is therefore standing still). With this setup, the hailstones new lines must cross at
  // a single point, which is the rock's starting point.
  const scale = 100000000000000;
  const h1 = hailstones[0];

  // Adjust velocity so it is relative to the rock
  h1.vector.x = (h1.vector.x - vx) * scale;
  h1.vector.y = (h1.vector.y - vy) * scale;
  h1.vector.z = (h1.vector.z - vz) * scale;

  const h2 = hailstones[1];

  // Adjust velocity so it is relative to the rock
  h2.vector.x = (h2.vector.x - vx) * scale;
  h2.vector.y = (h2.vector.y - vy) * scale;
  h2.vector.z = (h2.vector.z - vz) * scale;

  // Find an intersection of these two new "lines"
  let result = findIntersection(h1, h2);

  if (result.type !== 'intersecting') throw 'Could not find interesecting line';

  // We need to round since the numbers are so large there is a margin of error with the floats.
  const x = Math.round(result.point!.x);
  const y = Math.round(result.point!.y);

  // Find again, using z inplace of x (as findIntersection only supports x,y currently).
  h1.vector.x = h1.vector.z;
  h1.point.x = h1.point.z;
  h2.vector.x = h2.vector.z;
  h2.point.x = h2.point.z;

  result = findIntersection(h1, h2);

  if (result.type !== 'intersecting') throw 'Could not find interesecting line';

  // Read x as z
  const z = Math.round(result.point!.x);

  log(x);
  log(y);
  log(z);
  log(x + y + z);
};

//start('./files/example.txt', 7, 27);
start('./files/input.txt', 200000000000000, 400000000000000);
