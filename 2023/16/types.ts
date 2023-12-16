import { CardinalDirection, Position } from '@utils/grid';

export type Space = Position & { char: string };

export type PositionAndDirection = Position & { direction: CardinalDirection };
