import { Move } from './types';

export const parseInput = (content: string): Move[] =>
  content.split('').map((c) => (c == '<' ? 'L' : 'R'));
