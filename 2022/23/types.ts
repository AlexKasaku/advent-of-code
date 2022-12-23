import { Position } from '@utils/grid';

export type Elf = Position;
export type MaybeElf = Elf | undefined;

export type Direction = 'N' | 'E' | 'S' | 'W';

//export type Space = Position & { elf?: Elf };

export type Bounds = { minX: number; maxX: number; minY: number; maxY: number };
