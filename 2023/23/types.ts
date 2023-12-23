import { Position } from '@utils/grid';

export type Space = Position & {
  char: string;
  isWall: boolean;
};
