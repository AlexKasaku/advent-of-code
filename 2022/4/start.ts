import intersect from '@utils/intersect';
import range from '@utils/range';
import fs from 'fs';
import { EOL } from 'os';
import path from 'path';

//const file = './files/example.txt';
const file = './files/input.txt';

const overlap = (line: string) => {
  const [oneString, twoString] = line.split(',');

  const one = oneString.split('-').map((x) => parseInt(x));
  const oneRange = range(one[0], one[1]);

  const two = twoString.split('-').map((x) => parseInt(x));
  const twoRange = range(two[0], two[1]);

  const intersection = intersect(oneRange, twoRange);

  return {
    total:
      intersection.length == oneRange.length ||
      intersection.length == twoRange.length,
    partly: intersection.length > 0,
  };
};

const start = async () => {
  const content = fs.readFileSync(path.join(__dirname, file), 'utf8');

  const overlaps = content.split(EOL).map(overlap);

  console.log(overlaps.filter((x) => x.total).length);
  console.log(overlaps.filter((x) => x.partly).length);
};

start();
