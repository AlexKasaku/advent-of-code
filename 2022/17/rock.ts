import { Position, Grid } from '@utils/grid';
import { Space } from './types';

export interface Rock {
  Position: Position;
  Shape: boolean[][];

  checkLeft: () => boolean;
  checkRight: () => boolean;
  checkDown: () => boolean;
  fillInSpace: () => void;
  //getShapeHeight: () => number;
}

class BaseRock implements Rock {
  Position: Position;
  Grid: Grid<Space>;

  Shape: boolean[][];

  constructor(position: Position, grid: Grid<Space>) {
    this.Position = position;
    this.Grid = grid;
    this.Shape = [[]];
  }

  compareShapeToGridSegment = (position: Position) => {
    const flatShape = this.Shape.flat();
    const segment = this.Grid.getSegment(
      position,
      this.Shape[0].length,
      this.Shape.length,
    ).flat();

    return (
      segment.length == flatShape.length &&
      !segment.flat().some((x, index) => flatShape[index] && x.isFilled)
    );
  };

  checkLeft = () =>
    this.compareShapeToGridSegment({
      x: this.Position.x - 1,
      y: this.Position.y,
    });
  checkRight = () =>
    this.compareShapeToGridSegment({
      x: this.Position.x + 1,
      y: this.Position.y,
    });
  checkDown = () =>
    this.compareShapeToGridSegment({
      x: this.Position.x,
      y: this.Position.y - 1,
    });

  fillInSpace = (): void => {
    const flatShape = this.Shape.flat();
    this.Grid.updateEachInSegment(
      this.Position,
      this.Shape[0].length,
      this.Shape.length,
      (space) => {
        const piece = flatShape.shift();
        if (piece) space.isFilled = true;
        return space;
      },
    );
  };

  //getShapeHeight = () => this.Shape.length;
}

export class HorizontalRock extends BaseRock {
  constructor(position: Position, grid: Grid<Space>) {
    super({ x: position.x, y: position.y }, grid);
    this.Shape = [[true, true, true, true]];
  }
}

export class PlusRock extends BaseRock {
  constructor(position: Position, grid: Grid<Space>) {
    super({ x: position.x, y: position.y }, grid);
    this.Shape = [
      [false, true, false],
      [true, true, true],
      [false, true, false],
    ];
  }
}

export class LRock extends BaseRock {
  constructor(position: Position, grid: Grid<Space>) {
    super({ x: position.x, y: position.y }, grid);

    // Note that shape appears vertically flipped here because the Y-index is flipped
    this.Shape = [
      [true, true, true],
      [false, false, true],
      [false, false, true],
    ];
  }
}

export class VerticalRock extends BaseRock {
  constructor(position: Position, grid: Grid<Space>) {
    super({ x: position.x, y: position.y }, grid);
    this.Shape = [[true], [true], [true], [true]];
  }
}

export class SquareRock extends BaseRock {
  constructor(position: Position, grid: Grid<Space>) {
    super({ x: position.x, y: position.y }, grid);
    this.Shape = [
      [true, true],
      [true, true],
    ];
  }
}
