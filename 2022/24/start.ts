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
      distanceToEnd: manhattanDistance(setup.start, setup.end),
      destinationsRemaining: [setup.end, setup.start, setup.end],
    },
  ];

  let iterations = 0;

  console.log('Starting iterations');

  // Used to track unique positions we've already met
  let visitedStates = new Set<string>();
  const stateToString = (state: State) =>
    `${state.position.x},${state.position.y},${
      state.stepsTaken % uniqueStates
    },${state.destinationsRemaining.length}`;

  while (states.length > 0) {
    iterations++;
    const currentState = states.shift()!;

    // Get grid state for next step. We need next move because that's where the blizzards will *BE*.
    const gridState = getGridState(
      setup,
      (currentState.stepsTaken + 1) % uniqueStates
    );

    const currentDestination = currentState.destinationsRemaining[0];

    // If we can move to the destination, just do that!
    if (nextToDestination(currentState, currentDestination)) {
      // Was this the last destination?
      if (currentState.destinationsRemaining.length == 1) {
        const stepsTakenToReachEnd = currentState.stepsTaken + 1;

        console.log('Shortest distance to end: ' + stepsTakenToReachEnd);
        console.log(`Processed ${iterations} iterations.`);
        break;
      } else {
        // Still got more legs to go! Add the next state for this destination.
        const destination = currentState.destinationsRemaining.shift()!;

        console.log(
          `Reached current destination on step: ${currentState.stepsTaken + 1}`
        );

        // Reset the state queue
        states = [
          {
            stepsTaken: currentState.stepsTaken + 1,
            distanceToEnd: manhattanDistance(
              destination,
              currentState.destinationsRemaining[0]
            ),
            position: destination,
            destinationsRemaining: [...currentState.destinationsRemaining],
          },
        ];
      }
    } else {
      // Create next move from all neghbours we can move to and add to queue. Find all neighbouring
      // spaces that aren't a wall and are empty
      const nextMoves = gridState
        .getNeighbours(currentState.position)
        .filter((space) => !space.wall && space.blizzards.length === 0);

      // Map those new positions to a new state. Steps taken + time move on 1.
      const nextStatesFromMoves: State[] = nextMoves.map(({ x, y }) => ({
        stepsTaken: currentState.stepsTaken + 1,
        position: { x, y },
        distanceToEnd: manhattanDistance({ x, y }, currentDestination),
        destinationsRemaining: [...currentState.destinationsRemaining],
      }));

      // Also add state where we decide to wait in place. Time moves on but steps take does not! We can only
      // do this if there won't be blizzards here next move.
      if (gridState.get(currentState.position)!.blizzards.length == 0)
        nextStatesFromMoves.push({
          ...currentState,
          stepsTaken: currentState.stepsTaken + 1,
          destinationsRemaining: [...currentState.destinationsRemaining],
        });

      for (const nextState of nextStatesFromMoves) {
        // First, check if we've ever visited such a state. If so then don't bother adding it:
        const key = stateToString(nextState);
        if (visitedStates.has(key)) continue;
        visitedStates.add(key);

        // Next, if there's a matching state in the queue (same state of blizzards + positions)
        // Don't add this one if the current step count is higher
        // But if our step count is lower, update that existing state

        const existingState = states.find(
          (s) =>
            s.position.x == nextState.position.x &&
            s.position.y == nextState.position.y &&
            s.stepsTaken % uniqueStates == nextState.stepsTaken % uniqueStates
        );

        if (existingState) {
          if (existingState.stepsTaken > nextState.stepsTaken) {
            existingState.stepsTaken = nextState.stepsTaken;
          } else {
            // A state already exists at the same position + blizzards, but with fewer steps, so don't
            // bother adding this stage
          }
        } else {
          // No matching state, add ours in.
          states.push(nextState);
        }
      }
    }
  }
};

start();
