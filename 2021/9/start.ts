import { Grid } from '@utils/grid';
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
};

const start = async () => {
  const content = fs.readFileSync(path.join(__dirname, file), 'utf8');

  const contentSplit = content.split(EOL).map((l) => l.split(''));

  const grid = new Grid(
    contentSplit[0].length,
    contentSplit.length,
    ({ x, y }) => ({
      x,
      y,
      height: parseInt(contentSplit[y][x]),
      lowPoint: false,
    })
  );

  // Find all low points
  for (const point of grid.Values.flat()) {
    if (grid.getNeighbours(point).every((p) => point.height < p.height))
      point.lowPoint = true;
  }

  // Get total risk level
  const totalRiskLevel = grid.Values.flat()
    .filter((x) => x.lowPoint)
    .map((x) => x.height + 1)
    .reduce(toSum);

  console.log(totalRiskLevel);
};

start();
