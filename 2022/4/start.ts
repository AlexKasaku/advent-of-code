import intersect from '@utils/intersect';
import range from '@utils/range';
import fs from 'fs';
import { EOL } from 'os';
import path from 'path';

const file = './files/example.txt';
//const file = './files/input.txt';

const parseRange = (rangeString: string) => {
  const [start, end] = rangeString.split('-').map((x) => parseInt(x));
  return range(start, end);
};

const overlap = (line: string) => {
  const [one, two] = line.split(',').map(parseRange);
  const intersection = intersect(one, two);

  return {
    total:
      intersection.length == one.length || intersection.length == two.length,
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
