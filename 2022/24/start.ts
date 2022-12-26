import { Position } from '@utils/grid';
import fs from 'fs';
import path from 'path';
import { State } from './types';
import { getGridState, manhattanDistance } from './utils';
import { parseInput } from './utils.parse';

//const file = './files/example.txt';
//const file = './files/example.2.txt';
const file = './files/input.txt';
//const file = './files/test.txt';

// Work out if next to destination, just see if we're above or below it
const nextToDestination = (state: State, destination: Position): boolean =>
  (state.position.x === destination.x &&
    state.position.y + 1 === destination.y) ||
  (state.position.x === destination.x &&
    state.position.y - 1 === destination.y);

const start = async () => {
  const content = fs.readFileSync(path.join(__dirname, file), 'utf8');

  const setup = parseInput(content);
  const uniqueStates = (setup.width - 2) * (setup.height - 2);

  // Now, let's solve it (eep).
  let states: State[] = [
    {
      stepsTaken: 0,
      position: { ...setup.start },
    },
  ];

  let iterations = 0;
  const destinations = [setup.end, setup.start, setup.end];

  console.log('Starting iterations');
  const startTime = performance.now();

  // Used to track unique positions we've already met
  let visitedStates = new Set<string>();
  const stateToString = (state: State) =>
    `${state.position.x},${state.position.y},${
      state.stepsTaken % uniqueStates
    }`;

  while (states.length > 0) {
    iterations++;
    const currentState = states.shift()!;

    // Get grid state for next step. We need next move because that's where the blizzards will *BE*.
    const gridState = getGridState(
      setup,
      (currentState.stepsTaken + 1) % uniqueStates
    );

    const currentDestination = destinations[0];

    // If we can move to the destination, just do that!
    if (nextToDestination(currentState, currentDestination)) {
      // Was this the last destination?
      if (destinations.length == 1) {
        const stepsTakenToReachEnd = currentState.stepsTaken + 1;

        console.log('Shortest distance to end: ' + stepsTakenToReachEnd);
        console.log(
          `Processed ${iterations} iterations in ${
            performance.now() - startTime
          }ms`
        );
        break;
      } else {
        // Still got more legs to go! Remove this destination.
        destinations.shift();

        console.log(
          `Reached current destination on step: ${currentState.stepsTaken + 1}`
        );

        // Reset the state queue
        states = [
          {
            stepsTaken: currentState.stepsTaken + 1,
            position: currentDestination,
          },
        ];
      }
    } else {
      // Create next move from all neghbours and this same sapce, we can move to and add to stack.
      const nextMoves = [
        ...gridState.getNeighbours(currentState.position),
        gridState.get(currentState.position)!,
      ].filter(
        (space) =>
          (!space.wall || space.start || space.end) &&
          space.blizzards.length === 0
      );

      // Map those new positions to a new state. Steps taken + time move on 1.
      const nextStatesFromMoves: State[] = nextMoves.map(({ x, y }) => ({
        stepsTaken: currentState.stepsTaken + 1,
        position: { x, y },
      }));

      for (const nextState of nextStatesFromMoves) {
        // First, check if we've ever visited such a state. If so then don't bother adding it:
        const key = stateToString(nextState);
        if (visitedStates.has(key)) continue;
        visitedStates.add(key);

        states.push(nextState);
      }
    }
  }
};

start();
