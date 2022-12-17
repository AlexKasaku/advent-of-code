import { Position, Grid } from '@utils/grid';
import { Space } from './types';

export interface Rock {
  Position: Position;

  checkLeft: () => boolean;
  checkRight: () => boolean;
  checkDown: () => boolean;
  fillInSpace: () => void;
}

class BaseRock {
  Position: Position;
  Grid: Grid<Space>;

  constructor(position: Position, grid: Grid<Space>) {
    this.Position = position;
    this.Grid = grid;
  }
}

//
// 0123
// ####
//
export class HorizontalRock extends BaseRock implements Rock {
  checkLeft = (): boolean =>
    this.Position.x > 0 &&
    !this.Grid.get({ x: this.Position.x - 1, y: this.Position.y })?.isFilled;

  checkRight = (): boolean =>
    this.Position.x < this.Grid.Width - 5 &&
    !this.Grid.get({ x: this.Position.x + 4, y: this.Position.y })?.isFilled;

  checkDown = (): boolean =>
    this.Position.y >= 1 &&
    !this.Grid.get({ x: this.Position.x, y: this.Position.y - 1 })?.isFilled &&
    !this.Grid.get({ x: this.Position.x + 1, y: this.Position.y - 1 })
      ?.isFilled &&
    !this.Grid.get({ x: this.Position.x + 2, y: this.Position.y - 1 })
      ?.isFilled &&
    !this.Grid.get({ x: this.Position.x + 3, y: this.Position.y - 1 })
      ?.isFilled;

  fillInSpace = (): void => {
    this.Grid.get(this.Position)!.isFilled = true;
    this.Grid.get({ x: this.Position.x + 1, y: this.Position.y })!.isFilled =
      true;
    this.Grid.get({ x: this.Position.x + 2, y: this.Position.y })!.isFilled =
      true;
    this.Grid.get({ x: this.Position.x + 3, y: this.Position.y })!.isFilled =
      true;
  };
}

//  012
//2 .#.
//1 ###
//0 .#.
//
export class PlusRock extends BaseRock implements Rock {
  checkLeft = (): boolean =>
    this.Position.x > 0 &&
    !this.Grid.get({ x: this.Position.x - 2, y: this.Position.y })?.isFilled &&
    !this.Grid.get({ x: this.Position.x - 1, y: this.Position.y - 1 })
      ?.isFilled &&
    !this.Grid.get({ x: this.Position.x - 2, y: this.Position.y - 2 })
      ?.isFilled;

  checkRight = (): boolean =>
    this.Position.x < this.Grid.Width - 4 &&
    !this.Grid.get({ x: this.Position.x + 2, y: this.Position.y })?.isFilled &&
    !this.Grid.get({ x: this.Position.x + 3, y: this.Position.y - 1 })
      ?.isFilled &&
    !this.Grid.get({ x: this.Position.x + 2, y: this.Position.y - 2 })
      ?.isFilled;

  checkDown = (): boolean =>
    this.Position.y >= 3 &&
    !this.Grid.get({ x: this.Position.x, y: this.Position.y - 2 })?.isFilled &&
    !this.Grid.get({ x: this.Position.x + 1, y: this.Position.y - 3 })
      ?.isFilled &&
    !this.Grid.get({ x: this.Position.x + 2, y: this.Position.y - 2 })
      ?.isFilled;

  fillInSpace = (): void => {
    this.Grid.get({ x: this.Position.x + 1, y: this.Position.y })!.isFilled =
      true;
    this.Grid.get({ x: this.Position.x, y: this.Position.y - 1 })!.isFilled =
      true;
    this.Grid.get({
      x: this.Position.x + 1,
      y: this.Position.y - 1,
    })!.isFilled = true;
    this.Grid.get({
      x: this.Position.x + 2,
      y: this.Position.y - 1,
    })!.isFilled = true;
    this.Grid.get({
      x: this.Position.x + 1,
      y: this.Position.y - 2,
    })!.isFilled = true;
  };
}
