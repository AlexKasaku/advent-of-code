import fs from 'fs';
import path from 'path';
import { buildGrid, orderBricksByLowest, parseInput } from './utils';
import { byAscending } from '@utils/sort';
import range from '@utils/range';
import { Grid3D } from '@utils/grid3d';
import { BrickPosition, Space } from './types';
import { renderGrid } from '2020/17/utils';

const debugMode = false;
const debug = (...params: any[]) => debugMode && console.log(...params);
const log = (...params: any[]) => console.log(...params);

type Dependencies = {
  bricksAbove: Map<BrickPosition, Set<BrickPosition>>;
  bricksBelow: Map<BrickPosition, Set<BrickPosition>>;
};

const placeBricksAndFindDependencies = (
  bricks: BrickPosition[],
  grid: Grid3D<Space>,
): Dependencies => {
  const bricksAbove = new Map<BrickPosition, Set<BrickPosition>>();
  const bricksBelow = new Map<BrickPosition, Set<BrickPosition>>();

  for (const brick of bricks) {
    bricksAbove.set(brick, new Set<BrickPosition>());
    bricksBelow.set(brick, new Set<BrickPosition>());
  }

  // Start dropping bricks in
  for (const brick of bricks) {
    const xRange = range(brick.end1.x, brick.end2.x).sort(byAscending);
    const yRange = range(brick.end1.y, brick.end2.y).sort(byAscending);
    const zMin = Math.min(brick.end1.z, brick.end2.z);
    const zMax = Math.max(brick.end1.z, brick.end2.z);

    // Look down from brick position until we meet another brick or the ground
    const stoppingDepth = findStoppingDepth(xRange, yRange, zMin, grid);

    // If brick starts at z coords 3,4,5 and we're stopping at 1, this becomes 1,2,3
    const zDifference = zMin - stoppingDepth;

    // Update brick coords. We can normalize at this point so end1 is always lowest
    brick.end1.z = zMin - zDifference;
    brick.end2.z = zMax - zDifference;

    const zRange = range(brick.end1.z, brick.end2.z).sort(byAscending);

    // Place brick
    for (const x of xRange) {
      for (const y of yRange) {
        for (const z of zRange) {
          grid.get({ x, y, z })!.brick = brick;
        }
      }
    }
  }

  // All bricks have been placed, work out what we can remove
  for (const brick of bricks) {
    const xRange = range(brick.end1.x, brick.end2.x).sort(byAscending);
    const yRange = range(brick.end1.y, brick.end2.y).sort(byAscending);
    const zRange = range(brick.end1.z, brick.end2.z).sort(byAscending);

    for (const x of xRange) {
      for (const y of yRange) {
        for (const z of zRange) {
          const space = grid.get({ x, y, z: z - 1 });

          // If the space below this bricks current space is occupied by another brick that isn't itself
          if (space && space.brick && space.brick !== brick) {
            bricksBelow.get(brick)!.add(space.brick);
            bricksAbove.get(space.brick)!.add(brick);
          }
        }
      }
    }
  }

  return { bricksAbove, bricksBelow };
};

const countRemovables = (
  bricks: BrickPosition[],
  { bricksAbove, bricksBelow }: Dependencies,
): void => {
  // Now we know how all the bricks are supported, work out what we can remove
  // A brick can be removed if it supports no bricks, or if every brick it supports is supported by another brick
  let canRemove = 0;
  for (const brick of bricks) {
    // Assume we can remove
    let canRemoveThis = true;

    // Unless we find a brick above this one, that also has no other supports
    for (const brickAbove of bricksAbove.get(brick)!)
      if (bricksBelow.get(brickAbove)!.size == 1) canRemoveThis = false;

    if (canRemoveThis) canRemove++;
  }
  log(canRemove);
};

const start = async (file: string) => {
  const content = fs.readFileSync(path.join(__dirname, file), 'utf8');

  const bricks = parseInput(content);
  orderBricksByLowest(bricks);
  const grid = buildGrid(bricks);

  const dependencies = placeBricksAndFindDependencies(bricks, grid);

  // Part1
  countRemovables(bricks, dependencies);
};

const findStoppingDepth = (
  xRange: number[],
  yRange: number[],
  lowestZ: number,
  grid: Grid3D<Space>,
): number => {
  for (let z = lowestZ; z > 1; z--) {
    for (const x of xRange) {
      for (const y of yRange) {
        const testPosition = { x, y, z: z - 1 };
        const positionBelow = grid.get(testPosition)!;

        if (positionBelow.brick !== null) {
          // Either at bottom or there's a brick below, place our brick.
          return z;
        }
      }
    }
  }
  return 1;
};

//start('./files/test.stacked.txt');
//start('./files/test.separate.txt');
//start('./files/test.crossed.txt');
//start('./files/test.upright.txt');

//start('./files/example.txt');
start('./files/input.txt');
