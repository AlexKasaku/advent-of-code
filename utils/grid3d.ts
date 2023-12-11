import { createAndInitArray } from './createArray';

export type Position3D = {
  x: number;
  y: number;
  z: number;
};

export class Grid3D<T> {
  Values: T[][][];
  readonly Width: number;
  readonly Height: number;
  readonly Depth: number;

  constructor(
    height: number,
    width: number,
    depth: number,
    initializationCallback?: (position: Position3D) => T,
  ) {
    this.Height = height;
    this.Width = width;
    this.Depth = depth;

    this.Values = createAndInitArray(
      (z, y, x) => initializationCallback?.({ x, y, z }),
      depth,
      height,
      width,
    );
  }

  getNeighbours = (point: Position3D, orthagonal: boolean = true) => {
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

  get = ({ x, y, z }: Position3D): T | undefined => this.Values[z]?.[y]?.[x];

  // Raise a callback for each neighbour to the provided position. Note that if T can be undefined
  // then the callback won't be rasied for that position.
  forEachNeighbour = (
    point: Position3D,
    callback: (value: T, position: Position3D) => void,
    orthagonal: boolean = true,
  ) => {
    for (let x = point.x - 1; x <= point.x + 1; x++) {
      for (let y = point.y - 1; y <= point.y + 1; y++) {
        for (let z = point.z - 1; z <= point.z + 1; z++) {
          // Skip non-adjacent and this point itself
          if (
            (orthagonal &&
              Math.abs(point.x - x) +
                Math.abs(point.y - y) +
                Math.abs(point.z - z) >
                1) ||
            (point.x == x && point.y == y && point.z == z)
          )
            continue;

          if (this.Values?.[z]?.[y]?.[x])
            callback(this.Values[z][y][x], { x, y, z });
        }
      }
    }
  };
}
