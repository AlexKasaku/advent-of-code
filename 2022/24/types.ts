import { Position } from '@utils/grid';

export type Direction = 'U' | 'R' | 'D' | 'L';

export type Blizzard = {
  start: Position;
  current: Position;
  direction: Direction;
};

export type Space = Position & {
  start: boolean;
  end: boolean;
  wall: boolean;
  blizzards: Blizzard[];
};

export type InitialSetup = {
  width: number;
  height: number;
  start: Position;
  end: Position;
  blizzards: Blizzard[];
};
