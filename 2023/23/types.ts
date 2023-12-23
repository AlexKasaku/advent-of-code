import { Position } from '@utils/grid';

export type Space = Position & {
  char: string;
  isWall: boolean;
};

// export type Node = {
//   x: number;
//   y: number;
//   type: 'normal' | 'start' | 'end';
// };

export type Graph = {
  start: string;
  end: string;
  nodes: Set<string>;
  nodePairs: Map<string, Set<string>>;
  nodePairWeights: Map<string, number>;
};
