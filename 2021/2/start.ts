import fs from 'fs';
import { EOL } from 'os';
import path from 'path';

//const file = './files/example.txt';
const file = './files/input.txt';

type Position = {
  horizontal: number;
  depth: number;
};

const start = async () => {
  const content = fs.readFileSync(path.join(__dirname, file), 'utf8');

  const position = content.split(EOL).reduce(
    (position, move) => {
      const [direction, deltaString] = move.split(' ');
      const delta = parseInt(deltaString);

      switch (direction) {
        case 'forward':
          position.horizontal += delta;
          break;
        case 'up':
          position.depth -= delta;
          break;
        case 'down':
          position.depth += delta;
          break;
      }

      return position;
    },
    { horizontal: 0, depth: 0 },
  );

  console.log(position);
  console.log(position.horizontal * position.depth);
};

start();
