import fs from 'fs';
import path from 'path';
import { parseInput, renderGrid } from './utils';
import { Grid } from '@utils/grid';
import { Space } from './types';

const debugMode = true;
const debug = (...params: any[]) => debugMode && console.log(...params);
const log = (...params: any[]) => console.log(...params);

const updateGridWithConnections = (grid: Grid<Space>): Space => {
  let startSpace = undefined;
  for (const space of grid.Values.flat()) {
    switch (space.char) {
      case '|':
        space.spaceN = grid.get({ x: space.x, y: space.y - 1 });
        space.spaceS = grid.get({ x: space.x, y: space.y + 1 });
        break;
      case '-':
        space.spaceE = grid.get({ x: space.x + 1, y: space.y });
        space.spaceW = grid.get({ x: space.x - 1, y: space.y });
        break;
      case 'F':
        space.spaceE = grid.get({ x: space.x + 1, y: space.y });
        space.spaceS = grid.get({ x: space.x, y: space.y + 1 });
        break;
      case 'L':
        space.spaceN = grid.get({ x: space.x, y: space.y - 1 });
        space.spaceE = grid.get({ x: space.x + 1, y: space.y });
        break;
      case 'J':
        space.spaceW = grid.get({ x: space.x - 1, y: space.y });
        space.spaceN = grid.get({ x: space.x, y: space.y - 1 });
        break;
      case '7':
        space.spaceW = grid.get({ x: space.x - 1, y: space.y });
        space.spaceS = grid.get({ x: space.x, y: space.y + 1 });
        break;
      case 'S':
        startSpace = space;
    }
  }
  if (!startSpace) throw 'Could not find starting space!';

  // Now connect start space up, which should have only 2 pipes running into it
  const startSpaceNeighbours = grid.getNeighbours(startSpace, true);

  for (const neighbour of startSpaceNeighbours) {
    if (neighbour.spaceN === startSpace) startSpace.spaceS = neighbour;
    if (neighbour.spaceE === startSpace) startSpace.spaceW = neighbour;
    if (neighbour.spaceS === startSpace) startSpace.spaceN = neighbour;
    if (neighbour.spaceW === startSpace) startSpace.spaceE = neighbour;
  }

  return startSpace;
};

const walkGrid = (grid: Grid<Space>, startSpace: Space): void => {
  const orthagonalDirections = ['N', 'E', 'S', 'W'] as const;
  type OrthagonalDirection = (typeof orthagonalDirections)[number];

  let distanceBackToStart = 1;
  let lastSpace = startSpace;

  let thisSpace = startSpace.spaceN ?? startSpace.spaceE ?? startSpace.spaceE!;

  startSpace.isLoop = true;

  do {
    // Update this space as part of loop
    thisSpace.isLoop = true;

    // Take the next exit that doesn't lead to where we just came from
    const nextSpace = [
      thisSpace.spaceN,
      thisSpace.spaceE,
      thisSpace.spaceS,
      thisSpace.spaceW,
    ].filter((s) => s !== undefined && s !== lastSpace)[0];

    lastSpace = thisSpace;
    thisSpace = nextSpace!;

    distanceBackToStart++;

    debug(`Moving to ${thisSpace.x},${thisSpace.y}`);
  } while (thisSpace != startSpace);

  log(distanceBackToStart / 2);
};

const start = async (file: string) => {
  const content = fs.readFileSync(path.join(__dirname, file), 'utf8');

  const grid = parseInput(content);

  // Process grid to connect spaces
  const startSpace = updateGridWithConnections(grid);

  // Part1: Walk the grid and count the spaces
  walkGrid(grid, startSpace);

  renderGrid(grid, true);
};

//start('./files/example.txt');
//start('./files/example2.txt');
start('./files/input.txt');
