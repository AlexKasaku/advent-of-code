import fs from 'fs';
import path from 'path';
import { parseInput, renderGrid } from './utils';
import { Grid } from '@utils/grid';
import { Space } from './types';
import toSum from '@utils/toSum';

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
  if (startSpace.spaceN !== undefined)
    startSpace.startSpaceAltChar =
      startSpace.spaceE !== undefined
        ? 'L'
        : startSpace.spaceS != undefined
          ? '|'
          : 'J';
  else if (startSpace.spaceE !== undefined)
    startSpace.startSpaceAltChar = startSpace.spaceS !== undefined ? 'F' : '-';
  else startSpace.startSpaceAltChar = '7';

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
  } while (thisSpace != startSpace);

  log(`Furthest space: ${distanceBackToStart / 2}`);
};

const findInsideLoopSpaces = (grid: Grid<Space>): void => {
  // Determine inside loop spaces by walking along each row. Each time we cross a pipe we
  // flip to inside / outside. Any non-loop spaces that are found whilst inside are marked as such.

  // Whenever we encounter pipe elbows we need to pay attention and only flip to inside/outside if
  // the next elbow piece completes the N/S cross

  // Should note that we'll only ever encounter an J or 7 *after* an L or J. As long we're only looking
  // at loop pieces!

  for (const row of grid.Values) {
    let insideLoop = false;
    let enteredFromN = false,
      enteredFromS = false;
    for (const space of row) {
      if (space.isLoop) {
        const char = space.char === 'S' ? space.startSpaceAltChar : space.char;

        switch (char) {
          case '|':
            insideLoop = !insideLoop;
            break;
          case 'L':
            enteredFromN = true;
            break;
          case 'F':
            enteredFromS = true;
            break;
          case '7':
            if (enteredFromN) insideLoop = !insideLoop;
            enteredFromN = false;
            enteredFromS = false;
            break;
          case 'J':
            if (enteredFromS) insideLoop = !insideLoop;
            enteredFromN = false;
            enteredFromS = false;
            break;
        }
      } else {
        if (insideLoop && !space.isLoop) space.isInsideLoop = true;
      }
    }
  }

  const insideSpaces = grid.Values.flat()
    .map((s) => (s.isInsideLoop ? 1 : 0))
    .reduce(toSum, 0);

  log(`Inside spaces: ${insideSpaces}`);
};

const start = async (file: string) => {
  const content = fs.readFileSync(path.join(__dirname, file), 'utf8');

  const grid = parseInput(content);

  // Process grid to connect spaces
  const startSpace = updateGridWithConnections(grid);

  // Part1: Walk the grid and count the spaces
  walkGrid(grid, startSpace);

  // Part2: Fill outside loop spaces
  findInsideLoopSpaces(grid);

  renderGrid(grid, true);
};

//start('./files/test.txt');
//start('./files/example2.txt');
start('./files/input.txt');
