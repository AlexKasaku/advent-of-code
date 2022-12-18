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

  getNeighbours = ({ x, y }: Position, orthagonal: boolean = true) => [
    ...(!orthagonal && x > 0 && y > 0 ? [this.Values[y - 1][x - 1]] : []), // Top-left
    ...(x > 0 ? [this.Values[y][x - 1]] : []), // Left
    ...(!orthagonal && x > 0 && y < this.Values.length - 1
      ? [this.Values[y + 1][x - 1]]
      : []), // Bottom-Left
    ...(y > 0 ? [this.Values[y - 1][x]] : []), // Top
    ...(y < this.Values.length - 1 ? [this.Values[y + 1][x]] : []), // Bottom
    ...(!orthagonal && x < this.Values[y].length - 1 && y > 0
      ? [this.Values[y - 1][x + 1]]
      : []), // Top-right
    ...(x < this.Values[y].length - 1 ? [this.Values[y][x + 1]] : []), // Right
    ...(!orthagonal &&
    x < this.Values[y].length - 1 &&
    y < this.Values.length - 1
      ? [this.Values[y + 1][x + 1]]
      : []), // Bottom-right
  ];

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
