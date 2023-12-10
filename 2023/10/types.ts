import { Position } from '@utils/grid';

export type Space = Position & {
  char: string;
  spaceN?: Space;
  spaceE?: Space;
  spaceS?: Space;
  spaceW?: Space;
  isPipe: boolean;
  isLoop: boolean;
  isInsideLoop: boolean;
  startSpaceAltChar: string;
};
