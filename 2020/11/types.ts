import { Position } from '@utils/grid';

export type Space = Position & {
  isSeat: boolean;
  isOccupied: boolean;
};
