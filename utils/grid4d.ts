import { createAndInitArray } from './createArray';

export type Position4D = {
  x: number;
  y: number;
  z: number;
  w: number;
};

export class Grid4D<T> {
  Values: T[][][][];
  readonly Width: number;
  readonly Height: number;
  readonly Depth: number;
  readonly Fourth: number;

  constructor(
    height: number,
    width: number,
    depth: number,
    fourth: number,
    initializationCallback?: (position: Position4D) => T,
  ) {
    this.Height = height;
    this.Width = width;
    this.Depth = depth;
    this.Fourth = fourth;

    this.Values = createAndInitArray(
      (w, z, y, x) => initializationCallback?.({ x, y, z, w }),
      fourth,
      depth,
      height,
      width,
    );
  }

  getNeighbours = (point: Position4D, orthagonal: boolean = true) => {
    const neighbours: T[] = [];
    this.forEachNeighbour(
      point,
      (value) => {
        neighbours.push(value);
      },
      orthagonal,
    );
    return neighbours;
  };

  get = ({ x, y, z, w }: Position4D): T | undefined =>
    this.Values[w]?.[z]?.[y]?.[x];

  // Raise a callback for each neighbour to the provided position. Note that if T can be undefined
  // then the callback won't be rasied for that position.
  forEachNeighbour = (
    point: Position4D,
    callback: (value: T, position: Position4D) => void,
    orthagonal: boolean = true,
  ) => {
    for (let x = point.x - 1; x <= point.x + 1; x++) {
      for (let y = point.y - 1; y <= point.y + 1; y++) {
        for (let z = point.z - 1; z <= point.z + 1; z++) {
          for (let w = point.w - 1; w <= point.w + 1; w++) {
            // Skip non-adjacent and this point itself
            if (
              (orthagonal &&
                Math.abs(point.x - x) +
                  Math.abs(point.y - y) +
                  Math.abs(point.z - z) +
                  Math.abs(point.w - w) >
                  1) ||
              (point.x == x && point.y == y && point.z == z && point.w == w)
            )
              continue;

            if (this.Values?.[w]?.[z]?.[y]?.[x])
              callback(this.Values[w][z][y][x], { x, y, z, w });
          }
        }
      }
    }
  };
}
