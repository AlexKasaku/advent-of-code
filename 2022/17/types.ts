import { Position } from '@utils/grid';

export type Move = 'L' | 'R';

export type Space = Position & { isFilled: boolean };
