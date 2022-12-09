import fs from 'fs';
import { EOL } from 'os';
import path from 'path';

//const file = './files/example.txt';
const file = './files/input.txt';

const debugMode = false;
const debug = (...params: any[]) => {
  if (debugMode) {
    console.log(params);
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

const updateTail = (tail: Point, head: Point): void => {
  // Tail moves towards Head if it is at least 2 spaces away in a direction
  const deltaY = head.y - tail.y;
  const deltaX = head.x - tail.x;

  if (
    (Math.abs(deltaY) == 2 || Math.abs(deltaX) == 2) &&
    (Math.abs(deltaY) == 1 || Math.abs(deltaX) == 1)
  ) {
    // Diagonal move, tail must move 1 in each axis towards head.
    debug('Tail: Diagonal move');
    tail.x += deltaX / Math.abs(deltaX);
    tail.y += deltaY / Math.abs(deltaY);
  } else if (Math.abs(deltaY) == 2 || Math.abs(deltaX) == 2) {
    // Straight move. It can only be in one direction so we can safely update both.
    debug('Tail: Straight move');
    tail.x += deltaX / 2;
    tail.y += deltaY / 2;
  } else {
    // Otherwise, head has not moved far away enough yet.
    debug('Tail: No move');
  }
};

const start = async () => {
  const content = fs.readFileSync(path.join(__dirname, file), 'utf8');

  const moves = parseInput(content);
  //const moves = parseInput(content).slice(0, 1);

  const head = { x: 0, y: 0 };
  const tail = { x: 0, y: 0 };

  const visitedPoints = new Set([pointToString(tail)]);

  debug(
    `Start: Head: ${pointToString(head)}. Tail: ${pointToString(
      tail
    )}. Visited: ${visitedPoints.size}`
  );

  moves.forEach(({ direction, times }) => {
    [...Array(times)].forEach((x) => {
      // Update head
      updateHead(head, direction);

      // Update tail
      updateTail(tail, head);

      // Record tail position
      visitedPoints.add(pointToString(tail));

      // Debug log
      debug(
        `Head moved: ${direction}. Head: ${pointToString(
          head
        )}. Tail: ${pointToString(tail)}. Visited: ${visitedPoints.size}`
      );
    });
  });

  console.log(visitedPoints.size);
};

start();
