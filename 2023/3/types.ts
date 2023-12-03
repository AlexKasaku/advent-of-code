import { Position } from '@utils/grid';

export type EngineSpace = Position & {
  value?: number;
  symbol?: string;
  adjacentToSymbol: boolean;
  adjacentGears: EngineSpace[];
  adjacentNumbersToThisGear: number[];
};
