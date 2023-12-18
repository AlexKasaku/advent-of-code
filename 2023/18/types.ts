import { CardinalDirection, Position } from '@utils/grid';

export type Step = {
  direction: CardinalDirection;
  value: number;
};

export type Space = Position & {
  dug: boolean;
};
