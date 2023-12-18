import { CardinalDirection, Position } from '@utils/grid';

export type Step = {
  direction: CardinalDirection;
  value: number;
  colour: string;
};

export type Space = Position & {
  dug: boolean;
  colour?: string;
};
