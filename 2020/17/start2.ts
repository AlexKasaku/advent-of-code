import fs from 'fs';
import path from 'path';
import { expandGrid, parseInput } from './utils2';

const debugMode = true;
const debug = (...params: any[]) => debugMode && console.log(...params);
const log = (...params: any[]) => console.log(...params);

const start = async (file: string) => {
  const content = fs.readFileSync(path.join(__dirname, file), 'utf8');

  let grid = parseInput(content);

  const totalCycles = 6;

  for (let cycle = 0; cycle < totalCycles; cycle++) {
    debug(`------ Cycle ${cycle} ----------`);

    const allCubes = grid.Values.flat(3);
    console.log(`Total cubes: ${allCubes.length}`);

    const toFlip = allCubes.filter((cube) => {
      const allNeighbours = grid.getNeighbours(cube, false);
      const activeNeighbours = allNeighbours.filter((c) => c.isActive).length;
      //debug(`${activeNeighbours}/${allNeighbours.length} neighbours active`);

      let flip = false;
      if (cube.isActive) {
        // If a cube is active and exactly 2 or 3 of its neighbors are also active, the cube remains active. Otherwise, the cube becomes inactive.
        flip = activeNeighbours < 2 || activeNeighbours > 3;
      } else {
        // If a cube is inactive but exactly 3 of its neighbors are active, the cube becomes active. Otherwise, the cube remains inactive.
        flip = activeNeighbours === 3;
      }
      // if (flip)
      //   debug(`Flipping [${cube.z},${cube.y},${cube.x}], was ${cube.isActive}`);
      return flip;
    });

    // Flip the cubes
    toFlip.forEach((c) => (c.isActive = !c.isActive));

    // Expand the grid by 1
    grid = expandGrid(grid);

    // Get all active
    const activeCubes = allCubes.filter((c) => c.isActive).length;
    log(`Active cubes: ${activeCubes}`);
  }
};

//start('./files/example.txt');
start('./files/input.txt');
