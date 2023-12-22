import { Position3D } from '@utils/grid3d';

export type BrickPosition = {
  end1: Position3D;
  end2: Position3D;
};

export type Space = Position3D & {
  brick: BrickPosition | null;
};
