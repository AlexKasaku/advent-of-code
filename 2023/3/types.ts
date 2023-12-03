import { Position } from '@utils/grid';

export type EngineSpace = Position & {
  value?: number;
  symbol?: string;
  adjacent: boolean;
};
