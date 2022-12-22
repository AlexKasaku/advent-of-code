import { Grid, Position } from '@utils/grid';
import { byDescending } from '@utils/sort';
import { EOL } from 'os';
import { ContentType, Direction, Move, Space } from './types';

export const parseMoves = (input: string): Move[] => {
  const moveRegex = /L|R|\d+/g;

  let match;
  const moves: Move[] = [];
  while ((match = moveRegex.exec(input)) !== null) {
    const [move] = match;

    moves.push(/\d+/.test(move) ? parseInt(move) : (move as Move));
  }
  return moves;
};

export const parseGrid = (input: string[]): Grid<Space> => {
  const width = input.map((line) => line.length).sort(byDescending)[0];
  const height = input.length;

  console.log(input);

  return new Grid<Space>(height, width, ({ x, y }) => ({
    x,
    y,
    lastFacing: null,
    content: getContentType(input[y]?.split('')[x]),
  }));
};

export const getContentType = (char: string | undefined): ContentType => {
  switch (char) {
    case '#':
      return 'wall';
    case '.':
      return 'open';
  }
  return 'void';
};

export const parseInput = (input: string): [Move[], Grid<Space>] => {
  const lines = input.split(EOL);

  // Parse moves
  const moves = parseMoves(lines.pop()!);
  const grid = parseGrid(lines.slice(0, lines.length - 1));

  return [moves, grid];
};

export const turn = (facing: Direction, direction: 'L' | 'R'): Direction => {
  switch (facing) {
    case 'U':
      return direction == 'L' ? 'L' : 'R';
    case 'R':
      return direction == 'L' ? 'U' : 'D';
    case 'D':
      return direction == 'L' ? 'R' : 'L';
    case 'L':
      return direction == 'L' ? 'D' : 'U';
  }
};

export const moveOnGrid = (
  grid: Grid<Space>,
  position: Position,
  facing: Direction,
  move: number
): Position => {
  // Move indicated number of steps in a direction
  let newPosition = position;

  while (move--) {
    // Must wrap around on void spaces or edege, and stop if hit wall
    let nextSpace: Space | undefined;
    switch (facing) {
      case 'R':
        nextSpace = grid.get({ x: newPosition.x + 1, y: newPosition.y });

        if (nextSpace?.content === 'void' || nextSpace?.content === undefined) {
          // Wrap around. Find first space that isn't void
          nextSpace = grid.Values[newPosition.y].find(
            (space) => space.content !== 'void'
          );
        }
        break;
      case 'L':
        nextSpace = grid.get({ x: newPosition.x - 1, y: newPosition.y });

        if (nextSpace?.content === 'void' || nextSpace?.content === undefined) {
          // Wrap around. Find first space that isn't void
          nextSpace = [...grid.Values[newPosition.y]]
            .reverse()
            .find((space) => space.content !== 'void');
        }
        break;
      case 'D':
        nextSpace = grid.get({ x: newPosition.x, y: newPosition.y + 1 });

        if (nextSpace?.content === 'void' || nextSpace?.content === undefined) {
          // Wrap around. Find first space that isn't void starting from top. Need
          // to take vertical slice of array.
          nextSpace = grid.Values.map((row) => row[newPosition.x]).find(
            (space) => space.content !== 'void'
          );
        }
        break;
      case 'U':
        nextSpace = grid.get({ x: newPosition.x, y: newPosition.y - 1 });

        if (nextSpace?.content === 'void' || nextSpace?.content === undefined) {
          // Wrap around. Find first space that isn't void starting from top. Need
          // to take vertical slice of array.
          nextSpace = grid.Values.map((row) => row[newPosition.x])
            .reverse()
            .find((space) => space.content !== 'void');
        }
        break;
    }

    if (nextSpace?.content === 'open') {
      newPosition = { x: nextSpace.x, y: nextSpace.y };
    } else if (nextSpace?.content === 'wall') {
      // Stop here
      move = 0;
    } else {
      // We shouldn't be here with the next space as void
      throw 'Next space should not be void';
    }

    // Record position on gird
    grid.get(newPosition)!.lastFacing = facing;
  }

  return newPosition;
};

const getRenderChar = (space: Space): string => {
  switch (space.content) {
    case 'open':
      switch (space.lastFacing) {
        case 'U':
          return '^';
        case 'R':
          return '>';
        case 'D':
          return 'v';
        case 'L':
          return '<';
      }
      return '.';
    case 'void':
      return ' ';
    case 'wall':
      return '#';
  }
};

export const renderGrid = (grid: Grid<Space>): void => {
  for (const row of grid.Values) {
    for (const space of row) {
      process.stdout.write(getRenderChar(space));
    }
    console.log();
  }
};
