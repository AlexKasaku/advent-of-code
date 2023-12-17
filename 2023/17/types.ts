import { Position } from '@utils/grid';

export type Space = Position & {
  heatCost: number;
};
