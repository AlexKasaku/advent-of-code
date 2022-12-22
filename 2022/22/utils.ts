import { Grid, Position } from '@utils/grid';
import range from '@utils/range';
import { byDescending } from '@utils/sort';
import { EOL } from 'os';
import { ContentType, Direction, Move, PositionAndFace, Space } from './types';

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
  move: number,
  wrapMap: Map<string, PositionAndFace>
): PositionAndFace => {
  // Move indicated number of steps in a direction
  let newPosition = position;
  let newFacing = facing;
  let wrappedPosAndFace;

  while (move--) {
    // Must wrap around on void spaces or edege, and stop if hit wall
    let nextSpace: Space | undefined;
    switch (newFacing) {
      case 'R':
        nextSpace = grid.get({ x: newPosition.x + 1, y: newPosition.y });
        break;
      case 'L':
        nextSpace = grid.get({ x: newPosition.x - 1, y: newPosition.y });
        break;
      case 'D':
        nextSpace = grid.get({ x: newPosition.x, y: newPosition.y + 1 });
        break;
      case 'U':
        nextSpace = grid.get({ x: newPosition.x, y: newPosition.y - 1 });
        break;
    }

    if (nextSpace?.content === 'void' || nextSpace?.content === undefined) {
      // Wrap around. Use the wrap map to find the next position and facing
      wrappedPosAndFace = wrapMap.get(
        `${newPosition.x},${newPosition.y},${newFacing}`
      );

      if (!wrappedPosAndFace)
        throw `Needed to wrap but failed to find result in map. Position: ${newPosition.x},${newPosition.y}. Facing: ${newFacing}`;

      console.log(
        `Wrapped from ${newPosition.x},${newPosition.y},${newFacing} to ${wrappedPosAndFace.position.x},${wrappedPosAndFace.position.y},${wrappedPosAndFace.facing}`
      );

      nextSpace = grid.get(wrappedPosAndFace.position);
    }

    if (nextSpace?.content === 'open') {
      newPosition = { x: nextSpace.x, y: nextSpace.y };
      newFacing = wrappedPosAndFace?.facing ?? newFacing;
    } else if (nextSpace?.content === 'wall') {
      // Stop here.
      move = 0;
    } else {
      // We shouldn't be here with the next space as void
      throw 'Next space should not be void';
    }

    // Record position on gird
    grid.get(newPosition)!.lastFacing = newFacing;
  }

  return { position: newPosition, facing: newFacing };
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

export const createWrapMapExample = (
  width: number,
  height: number
): Map<string, PositionAndFace> => {
  const wrapMap = new Map<string, PositionAndFace>();

  [0, 1, 2, 3].forEach((i) => {
    // 1 - 2
    wrapMap.set(`${(width * 2) / 4 + i},0,U`, {
      position: { x: (width * 1) / 4 - 1 - i, y: (height * 1) / 3 },
      facing: 'D',
    });
    wrapMap.set(`${(width * 1) / 4 - 1 - i},${(height * 1) / 3},U`, {
      position: { x: (width * 2) / 4 + i, y: 0 },
      facing: 'D',
    });

    // 1 - 3
    wrapMap.set(`${(width * 2) / 4},${i},L`, {
      position: { x: (width * 1) / 4 + i, y: (height * 1) / 3 },
      facing: 'D',
    });
    wrapMap.set(`${(width * 1) / 4 + i},${(height * 1) / 3},U`, {
      position: { x: (width * 2) / 4, y: i },
      facing: 'R',
    });

    // 1 - 6
    wrapMap.set(`${(width * 3) / 4 - 1},${i},R`, {
      position: { x: width - 1, y: height - 1 - i },
      facing: 'L',
    });
    wrapMap.set(`${width - 1},${height - 1 - i},R`, {
      position: { x: (width * 3) / 4 - 1, y: i },
      facing: 'L',
    });

    // 2 - 6
    wrapMap.set(`${0},${(height * 1) / 3 + i},L`, {
      position: { x: width - 1 - i, y: height - 1 },
      facing: 'U',
    });
    wrapMap.set(`${width - 1 - i},${height - 1},D`, {
      position: { x: 0, y: (height * 1) / 3 + i },
      facing: 'R',
    });

    // 3 - 5
    wrapMap.set(`${(width * 1) / 4 + i},${(height * 2) / 3 - 1},D`, {
      position: { x: (width * 2) / 4, y: (height * 2) / 3 + i },
      facing: 'L',
    });
    wrapMap.set(`${(width * 2) / 4},${(height * 2) / 3 + i},R`, {
      position: { x: (width * 1) / 4 + i, y: (height * 2) / 3 - 1 },
      facing: 'U',
    });

    // 2 - 5
    wrapMap.set(`${i},${(height * 2) / 3 - 1},D`, {
      position: { x: (width * 3) / 4 - 1 - i, y: height - 1 },
      facing: 'U',
    });
    wrapMap.set(`${(width * 3) / 4 - 1 - i},${height - 1},D`, {
      position: { x: i, y: (height * 2) / 3 - i },
      facing: 'U',
    });

    // 4 - 6
    wrapMap.set(`${(width * 3) / 4 - 1},${(height * 1) / 3 + i},R`, {
      position: { x: width - 1 - i, y: (height * 2) / 3 },
      facing: 'D',
    });
    wrapMap.set(`${width - 1 - i},${(height * 2) / 3},U`, {
      position: { x: (width * 3) / 4 - 1, y: (height * 1) / 3 + i },
      facing: 'L',
    });
  });

  return wrapMap;
};

export const createWrapMapReal = (
  width: number,
  height: number
): Map<string, PositionAndFace> => {
  const wrapMap = new Map<string, PositionAndFace>();

  range(0, 49).forEach((i) => {
    // 1 - 2
    wrapMap.set(`${(width * 1) / 3 + i},0,U`, {
      position: { x: 0, y: (height * 3) / 4 + i },
      facing: 'R',
    });
    wrapMap.set(`0,${(height * 3) / 4 + i},L`, {
      position: { x: (width * 1) / 3 + i, y: 0 },
      facing: 'D',
    });

    // 1 - 3
    wrapMap.set(`${(width * 1) / 3},${i},L`, {
      position: { x: 0, y: (height * 3) / 4 - 1 - i },
      facing: 'R',
    });
    wrapMap.set(`0,${(height * 3) / 4 - 1 - i},L`, {
      position: { x: (width * 1) / 3, y: i },
      facing: 'R',
    });

    // 4 - 3
    wrapMap.set(`${(width * 1) / 3},${(height * 1) / 4 + i},L`, {
      position: { x: i, y: (height * 2) / 4 },
      facing: 'D',
    });
    wrapMap.set(`${i},${(height * 2) / 4},U`, {
      position: { x: (width * 1) / 3, y: (height * 1) / 4 + i },
      facing: 'R',
    });

    // 4 - 6
    wrapMap.set(`${(width * 2) / 3 - 1},${(height * 1) / 4 + i},R`, {
      position: { x: (width * 2) / 3 + i, y: (height * 1) / 4 - 1 },
      facing: 'U',
    });
    wrapMap.set(`${(width * 2) / 3 + i},${(height * 1) / 4 - 1},D`, {
      position: { x: (width * 2) / 3 - 1, y: (height * 1) / 4 + i },
      facing: 'L',
    });

    // 6 - 2
    wrapMap.set(`${(width * 2) / 3 + i},0,U`, {
      position: { x: i, y: height - 1 },
      facing: 'U',
    });
    wrapMap.set(`${i},${height - 1},D`, {
      position: { x: (width * 2) / 3 + i, y: 0 },
      facing: 'D',
    });

    // 6 - 5
    wrapMap.set(`${width - 1},${i},R`, {
      position: { x: (width * 2) / 3 - 1, y: (height * 3) / 4 - 1 - i },
      facing: 'L',
    });
    wrapMap.set(`${(width * 2) / 3 - 1},${(height * 3) / 4 - 1 - i},R`, {
      position: { x: width - 1, y: i },
      facing: 'L',
    });

    // 2 - 5
    wrapMap.set(`${(width * 1) / 3 - 1},${(height * 3) / 4 + i},R`, {
      position: { x: (width * 1) / 3 + i, y: (height * 3) / 4 - 1 },
      facing: 'U',
    });
    wrapMap.set(`${(width * 1) / 3 + i},${(height * 3) / 4 - 1},D`, {
      position: { x: (width * 1) / 3 - 1, y: (height * 3) / 4 + i },
      facing: 'L',
    });
  });

  return wrapMap;
};
