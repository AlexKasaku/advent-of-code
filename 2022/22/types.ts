import { Position } from '@utils/grid';

export type Direction = 'U' | 'R' | 'D' | 'L';

export type ContentType = 'void' | 'open' | 'wall';

export type Move = 'L' | 'R' | number;

export type Space = Position & {
  lastFacing: Direction | null;
  content: ContentType;
};

export type PositionAndFace = { position: Position; facing: Direction };

export type WrapMap = Map<string, PositionAndFace>;
