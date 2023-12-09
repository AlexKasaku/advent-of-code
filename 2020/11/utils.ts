import { Grid, allDirections } from '@utils/grid';
import { EOL } from 'os';
import { Space } from './types';

export const parseInput = (input: string) => {
  const values = input.split(EOL).map((line) => line.split(''));

  return new Grid<Space>(values.length, values[0].length, ({ x, y }) => ({
    x,
    y,
    isSeat: values[y][x] === 'L',
    isOccupied: false,
  }));
};

export const getSeatsToFlip = (
  seatPlan: Grid<Space>,
  isPart1: boolean,
): Space[] => {
  const allSeats = seatPlan.Values.flat().filter((s) => s.isSeat);

  if (isPart1) {
    return allSeats.filter(
      (seat) =>
        (!seat.isOccupied &&
          seatPlan
            .getNeighbours(seat, false)
            .filter((s) => s.isSeat)
            .every((s) => !s.isOccupied)) ||
        (seat.isOccupied &&
          seatPlan
            .getNeighbours(seat, false)
            .filter((s) => s.isSeat)
            .filter((s) => s.isOccupied).length >= 4),
    );
  } else {
    return allSeats.filter((seat) => {
      // Look in each direction for seats
      const firstSeatsInEachDirection = allDirections
        .map(
          (direction) =>
            seatPlan
              .getAllInDirection(seat, direction)
              .filter((s) => s?.isSeat)?.[0],
        )
        .filter((s) => s !== undefined);

      if (seat.isOccupied) {
        return (
          firstSeatsInEachDirection.filter((s) => s?.isOccupied).length >= 5
        );
      } else {
        return firstSeatsInEachDirection.every((s) => !s?.isOccupied);
      }
    });
  }
};
