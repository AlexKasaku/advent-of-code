import { Position } from '@utils/grid';

export type Space = Position & {
  isRock: boolean;
  visited: boolean;
  visitedOnStep: number | null;
};
