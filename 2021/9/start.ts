import { Grid } from '@utils/grid';
import { byDescending } from '@utils/sort';
import toSum from '@utils/toSum';
import fs from 'fs';
import { EOL } from 'os';
import path from 'path';

//const file = './files/example.txt';
const file = './files/input.txt';

type Location = {
  x: number;
  y: number;
  height: number;
  lowPoint: boolean;
  basin?: number;
};

const start = async () => {
  const content = fs.readFileSync(path.join(__dirname, file), 'utf8');

  const contentSplit = content.split(EOL).map((l) => l.split(''));

  const grid = new Grid<Location>(
    contentSplit[0].length,
    contentSplit.length,
    ({ x, y }) => ({
      x,
      y,
      height: parseInt(contentSplit[y][x]),
      lowPoint: false,
    }),
  );

  // Find all low points and assign them a basin
  let basin = 0;
  for (const point of grid.Values.flat()) {
    if (grid.getNeighbours(point).every((p) => point.height < p.height)) {
      point.lowPoint = true;
      point.basin = basin++;
    }
  }

  // Find all points belonging to basins
  for (let x = 0; x < basin; x++) {
    const toVisit = [grid.Values.flat().find((p) => p.basin === x)];

    // Keep going until visit array is empty
    while (toVisit.length > 0) {
      const candidate = toVisit.shift()!;

      candidate.basin = x;

      // Add any neighbours that are under 9 in height and not yet in a basin
      toVisit.push(
        ...grid
          .getNeighbours(candidate)
          .filter((x) => x.height < 9 && x.basin === undefined),
      );
    }
  }

  // Now count the largest basins
  const isDefined = <T>(item: T | undefined): item is T => item !== undefined;
  const basins = grid.Values.flat()
    .map((x) => x.basin)
    .filter(isDefined)
    .reduce((a, b) => {
      a[b] = (a[b] ?? 0) + 1;
      return a;
    }, [] as number[]);

  console.log(
    basins
      .sort(byDescending)
      .slice(0, 3)
      .reduce((a, b) => a * b),
  );
  // Get total risk level
  // const totalRiskLevel = grid.Values.flat()
  //   .filter((x) => x.lowPoint)
  //   .map((x) => x.height + 1)
  //   .reduce(toSum);

  // console.log(totalRiskLevel);
};

start();
