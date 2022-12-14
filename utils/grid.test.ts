import { Direction, Grid } from './grid';

describe('grid', () => {
  describe('getNeighbours', () => {
    const grid = new Grid(3, 3, ({ x, y }) => y * 3 + x + 1);

    it.each([
      [{ x: 0, y: 0 }, [2, 4, 5]],
      [{ x: 1, y: 0 }, [1, 3, 4, 5, 6]],
      [{ x: 2, y: 0 }, [2, 5, 6]],
      [{ x: 0, y: 1 }, [1, 2, 5, 7, 8]],
      [{ x: 1, y: 1 }, [1, 2, 3, 4, 6, 7, 8, 9]],
      [{ x: 2, y: 1 }, [2, 3, 5, 8, 9]],
      [{ x: 0, y: 2 }, [4, 5, 8]],
      [{ x: 1, y: 2 }, [4, 5, 6, 7, 9]],
      [{ x: 2, y: 2 }, [5, 6, 8]],
    ])(
      'returns correct neighbours for non-orthagonal',
      (position, expected) => {
        expect(grid.getNeighbours(position, false).sort()).toEqual(expected);
      }
    );

    it.each([
      [{ x: 0, y: 0 }, [2, 4]],
      [{ x: 1, y: 0 }, [1, 3, 5]],
      [{ x: 2, y: 0 }, [2, 6]],
      [{ x: 0, y: 1 }, [1, 5, 7]],
      [{ x: 1, y: 1 }, [2, 4, 6, 8]],
      [{ x: 2, y: 1 }, [3, 5, 9]],
      [{ x: 0, y: 2 }, [4, 8]],
      [{ x: 1, y: 2 }, [5, 7, 9]],
      [{ x: 2, y: 2 }, [6, 8]],
    ])('returns correct neighbours for orthagonal', (position, expected) => {
      expect(grid.getNeighbours(position).sort()).toEqual(expected);
      expect(grid.getNeighbours(position, true).sort()).toEqual(expected);
    });
  });

  describe('getAllInDirection', () => {
    const grid = new Grid(3, 3, ({ x, y }) => y * 3 + x + 1);

    it.each([[{ x: 0, y: 0 }, 'up', true, [1]]])(
      'returns correct positions',
      (position, direction, inclusive, expected) => {
        expect(
          grid.getAllInDirection(position, direction as Direction, inclusive)
        ).toEqual(expected);
      }
    );
  });
});
