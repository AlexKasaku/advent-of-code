import { Position3D } from '@utils/grid3d';
import { Position4D } from '@utils/grid4d';

export type Cube = Position3D & { isActive: boolean };
export type Cube4D = Position4D & { isActive: boolean };
