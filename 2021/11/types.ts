import { Position } from '@utils/grid';

export type Octopus = Position & { value: number; flashed: boolean };
