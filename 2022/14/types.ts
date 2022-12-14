export type Point = { x: number; y: number };

export type Line = {
  start: Point;
  end: Point;
};

export type ContentType = 'rock' | 'sand' | null;
export type Space = Point & { content: ContentType };
