import { Grid } from '@utils/grid';
import { EOL } from 'os';
import { Move, Space } from './types';

export const parseInput = (content: string): Move[] =>
  content.split('').map((c) => (c == '<' ? 'L' : 'R'));

export const renderGrid = (grid: Grid<Space>, rows: number): void => {
  for (let y = rows; y >= 0; y--) {
    for (let x = 0; x < grid.Width; x++)
      process.stdout.write(grid.get({ x, y })?.isFilled ? '🟩' : '⚫');
    process.stdout.write(EOL);
  }
};
