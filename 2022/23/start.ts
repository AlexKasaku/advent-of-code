import { Grid } from '@utils/grid';
import fs from 'fs';
import path from 'path';
import { Direction, Elf, MaybeElf } from './types';
import {
  findNewPosition,
  parseInput,
  positionToString,
  renderPartialGrid,
  stringToPosition,
  updateDirectionsToConsider,
} from './utils';

const file = './files/example.txt';
//const file = './files/input.txt';

const start = async () => {
  const content = fs.readFileSync(path.join(__dirname, file), 'utf8');

  const [grid, elves] = parseInput(content);

  const directionsToConsider: Direction[] = ['N', 'S', 'W', 'E'];

  let rounds = 10;
  while (rounds--) {
    const movementMap = new Map<string, Elf[]>();

    // For each elf, determine if it will try to move
    for (const elf of elves) {
      if (grid.getNeighbours(elf, false).every((e) => e === undefined)) {
        // No surrounding elves, staying put!
      } else {
        // Find if there's a possible movement
        const newPosition = findNewPosition(grid, elf, directionsToConsider);

        if (newPosition) {
          // The elf has found somewhere, add it to the movement map
          const posAsString = positionToString(newPosition);
          if (movementMap.has(posAsString))
            movementMap.get(posAsString)!.push(elf);
          else movementMap.set(posAsString, [elf]);
        }
      }
    }

    // For all the elves who want to move, only apply moves for just one elf
    [...movementMap.entries()]
      .filter(([_, elves]) => elves.length == 1)
      .forEach(([position, elves]) => {
        const newPosition = stringToPosition(position);
        const [elf] = elves;

        grid.set(elf, undefined);
        elf.x = newPosition.x;
        elf.y = newPosition.y;
        grid.set(elf, elf);
      });

    // Finally, rotate directions
    updateDirectionsToConsider(directionsToConsider);

    // Find bounding rectangle
    let minX = elves[0].x,
      maxX = elves[0].x,
      minY = elves[0].y,
      maxY = elves[0].y;

    for (const elf of elves) {
      minX = Math.min(minX, elf.x);
      maxX = Math.max(maxX, elf.x);
      minY = Math.min(minY, elf.y);
      maxY = Math.max(maxY, elf.y);
    }

    // const rectangleSize = (maxX - minX) * (maxY - minY);
    // console.log(rectangleSize);

    renderPartialGrid(grid, minX, maxX, minY, maxY);
    console.log();

    // const emptyTiles = rectangleSize - elves.length;
    // console.log(emptyTiles);
  }

  //  console.log(elves);
};

start();
