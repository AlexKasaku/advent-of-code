import { Position } from '@utils/grid';

export type Space = {
  isGalaxy: boolean;
};

export type SpaceWithPosition = Position & Space;
