import { range } from 'lodash';
import { createAndInitArray } from './createArray';

export type Position = {
  x: number;
  y: number;
};

export type Direction = 'up' | 'down' | 'left' | 'right';

export class Grid<T> {
  Values: T[][];
  readonly Width: number;
  readonly Height: number;

  constructor(
    width: number,
    height: number,
    initializationCallback?: (position: Position) => T
  ) {
    this.Width = width;
    this.Height = height;

    this.Values = createAndInitArray(
      (y, x) => initializationCallback?.({ x, y }),
      width,
      height
    );
  }

  getNeighbours = (point: Position, orthagonal: boolean = true) => {
    const neighbours: T[] = [];
    this.forEachNeighbour(
      point,
      (value) => {
        neighbours.push(value);
      },
      orthagonal
    );
    return neighbours;
  };

  // Raise a callback for each neighbour to the provided position. Note that if T can be undefined
  // then the callback won't be rasied for that position.
  forEachNeighbour = (
    point: Position,
    callback: (value: T, position: Position) => void,
    orthagonal: boolean = true
  ) => {
    for (let x = point.x - 1; x <= point.x + 1; x++) {
      for (let y = point.y - 1; y <= point.y + 1; y++) {
        // Skip non-adjacent and yourself
        if (
          (orthagonal && Math.abs(point.x - x) + Math.abs(point.y - y) > 1) ||
          (point.x == x && point.y == y)
        )
          continue;

        if (this.Values?.[y]?.[x]) callback(this.Values[y][x], { x, y });
      }
    }
  };

  getAllInDirection = (
    { x, y }: Position,
    direction: Direction,
    inclusive: boolean
  ) => {
    switch (direction) {
      case 'up':
        range(0, y).map((x1) => this.Values[y][x1]);
    }
  };

  get = ({ x, y }: Position): T | undefined => this.Values[y]?.[x];
  set = ({ x, y }: Position, value: T): void => {
    this.Values[y][x] = value;
  };

  getSegment = ({ x, y }: Position, width: number, height: number) =>
    this.Values.slice(y, y + height).map((row) => row.slice(x, x + width));

  updateEachInSegment = (
    { x, y }: Position,
    width: number,
    height: number,
    callback: (value: T) => T
  ): void => {
    for (let curY = y; curY < y + height; curY++) {
      for (let curX = x; curX < x + width; curX++)
        this.Values[curY][curX] = callback(this.Values[curY][curX]);
    }
  };

  log = () => {
    console.dir(this.Values, { depth: null });
  };
}
