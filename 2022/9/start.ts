import fs from 'fs';
import { EOL } from 'os';
import path from 'path';

//const file = './files/example.txt';
const file = './files/input.txt';

const debugMode = false;
const debug = (...params: any[]) => {
  if (debugMode) {
    console.log(...params);
  }
};

type Point = { x: number; y: number };
type Direction = 'U' | 'D' | 'L' | 'R';
type Move = { direction: Direction; times: number };

const parseInput = (input: string): Move[] =>
  input.split(EOL).map((l) => {
    const [direction, timesAsString] = l.split(' ');
    return {
      direction: direction as Direction,
      times: parseInt(timesAsString),
    };
  });

const pointToString = ({ x, y }: Point) => `x${x}y${y}`;

const updateHead = (head: Point, direction: Direction): void => {
  switch (direction) {
    case 'U':
      head.y += 1;
      break;
    case 'D':
      head.y -= 1;
      break;
    case 'L':
      head.x -= 1;
      break;
    case 'R':
      head.x += 1;
      break;
  }
};

const updateToFollow = (tail: Point, head: Point): void => {
  const deltaY = head.y - tail.y;
  const deltaX = head.x - tail.x;

  // Tail moves towards Head if it is at least 2 spaces away in a direction
  // We can multiply deltaX * deltaY and if that's at least 2 then it's moved
  // enough. We count a 0 as 1 so straight moves count.
  if (Math.abs((deltaX || 1) * (deltaY || 1)) >= 2) {
    // The head has moved enough for us to move. Move 1 towards it
    // in each direction if it has moved that way.
    tail.x += deltaX ? Math.sign(deltaX) : 0;
    tail.y += deltaY ? Math.sign(deltaY) : 0;
  } else {
    // Head has not moved far away enough yet.
    debug('No move');
  }
};

const start = async () => {
  const content = fs.readFileSync(path.join(__dirname, file), 'utf8');

  const moves = parseInput(content);

  // Part 1 = 2, Part 2 = 10
  const ropeSize = 10;
  const rope = [...Array(ropeSize)].map(() => ({ x: 0, y: 0 }));

  const visitedPoints = new Set([pointToString(rope[rope.length - 1])]);

  debug(
    `Start: Head: ${pointToString(rope[0])}. Tail: ${pointToString(
      rope[rope.length - 1]
    )}. Visited: ${visitedPoints.size}`
  );

  moves.forEach(({ direction, times }) => {
    [...Array(times)].forEach((x) => {
      // Update head
      updateHead(rope[0], direction);

      // Update remaining positions
      for (let pos = 1; pos < rope.length; pos++)
        updateToFollow(rope[pos], rope[pos - 1]);

      // Record tail position
      visitedPoints.add(pointToString(rope[rope.length - 1]));

      // Debug log
      debug(
        `Head moved: ${direction}. Head: ${pointToString(
          rope[0]
        )}. Tail: ${pointToString(rope[rope.length - 1])}. Visited: ${
          visitedPoints.size
        }`
      );
    });
  });

  console.log(visitedPoints.size);
};

start();
