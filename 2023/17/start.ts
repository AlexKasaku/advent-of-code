import fs from 'fs';
import path from 'path';
import { parseInput } from './utils';
import { Space } from './types';
import {
  CardinalDirection,
  Grid,
  Position,
  turnLeft,
  turnRight,
} from '@utils/grid';
import priorityQueue from '@utils/priorityQueue';

const debugMode = false;
const debug = (...params: any[]) => debugMode && console.log(...params);
const log = (...params: any[]) => console.log(...params);

type State = {
  position: Position;
  direction: CardinalDirection;
  straight: number;
};

type Route = {
  state: State;
  heatCost: number;
};

const getStateKey = ({
  position: { x, y },
  direction,
  straight,
}: State): string => `${x},${y},${direction},${straight}`;

const findSmallestHeatCost = (
  grid: Grid<Space>,
  minStraight: number,
  maxStraight: number,
) => {
  const lowestHeatForState = new Map<string, number>();

  const queue = priorityQueue<Route>((a, b) => a.heatCost <= b.heatCost);

  queue.insert(
    {
      state: { position: { x: 0, y: 1 }, straight: 1, direction: 'S' },
      heatCost: 0,
    },
    {
      state: { position: { x: 1, y: 0 }, straight: 1, direction: 'E' },
      heatCost: 0,
    },
  );

  while (!queue.isEmpty()) {
    const { state, heatCost } = queue.dequeue()!;

    // Heat up to here
    const currentPosition = state.position;
    const newHeatCost = grid.get(currentPosition)!.heatCost + heatCost;

    if (
      currentPosition.x == grid.Width - 1 &&
      currentPosition.y == grid.Height - 1
    ) {
      // Reached end. What's our score?
      log(`Reached goal!`);
      log('Final state:');
      log(state);
      log(`Total heat: ${newHeatCost}`);
      return;
    } else {
      // Have we been to this space before, and was it with a lower value?
      const stateKey = getStateKey(state);
      const previousVisit = lowestHeatForState.get(stateKey);
      if (previousVisit !== undefined && previousVisit <= newHeatCost) continue;

      // This is new or better visit for this space
      lowestHeatForState.set(stateKey, newHeatCost);

      if (state.straight >= minStraight) {
        // Turn left
        const directionToLeft = turnLeft(state.direction);
        const nextSpaceToLeft = grid.getAllInDirection(
          state.position,
          directionToLeft,
          1,
        )?.[0];

        if (nextSpaceToLeft)
          queue.insert({
            state: {
              position: nextSpaceToLeft,
              direction: directionToLeft,
              straight: 1,
            },
            heatCost: newHeatCost,
          });

        // Turn right
        const directionToRight = turnRight(state.direction);
        const nextSpaceToRight = grid.getAllInDirection(
          state.position,
          directionToRight,
          1,
        )?.[0];

        if (nextSpaceToRight)
          queue.insert({
            state: {
              position: nextSpaceToRight,
              direction: directionToRight,
              straight: 1,
            },
            heatCost: newHeatCost,
          });
      }
      if (state.straight < maxStraight) {
        // Straight ahead
        const nextSpaceAhead = grid.getAllInDirection(
          state.position,
          state.direction,
          1,
        )?.[0];

        if (nextSpaceAhead)
          queue.insert({
            state: {
              position: nextSpaceAhead,
              direction: state.direction,
              straight: state.straight + 1,
            },
            heatCost: newHeatCost,
          });
      }
    }
  }
};
const start = async (file: string) => {
  const content = fs.readFileSync(path.join(__dirname, file), 'utf8');

  const grid = parseInput(content);

  // Part 1
  //findSmallestHeatCost(grid, 0, 3);

  // Part 2
  findSmallestHeatCost(grid, 4, 10);
};

//start('./files/example.txt');
start('./files/input.txt');
