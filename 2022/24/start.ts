import { Position } from '@utils/grid';
import range from '@utils/range';
import fs from 'fs';
import { endianness } from 'os';
import path from 'path';
import { State } from './types';
import { buildAllGridStates, getGridState, manhattanDistance } from './utils';
import { parseInput } from './utils.parse';
import { renderGrid } from './utils.render';

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

  console.log('Parsed input, building states');

  // Blizzard states loop, so precalculate all states!
  //const gridStates = buildAllGridStates(setup, uniqueStates);

  console.log('Built states');

  // Now, let's solve it (eep).
  let states: State[] = [
    {
      stepsTaken: 0,
      position: { ...setup.start },
      distanceToEnd: manhattanDistance(setup.start, setup.end),
      destinationsRemaining: [setup.end, setup.start, setup.end],
    },
  ];

  let stepsToEnd = Infinity;
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
    if (iterations % 100000 == 0)
      console.log(
        `Processed ${iterations} iterations. Current state queue: ${states.length}`
      );

    const currentState = states.shift()!;

    // Get grid state for next step. We need next move because that's where the blizzards will *BE*.
    const gridState = getGridState(
      setup,
      (currentState.stepsTaken + 1) % uniqueStates
    );

    // If ever we've taken more steps than the current shortest route, just skip. Add 1 on because each state
    // is always 1 step away from the end
    if (currentState.stepsTaken + 1 >= stepsToEnd) continue;

    const currentDestination = currentState.destinationsRemaining[0];

    // If we can move to the destination, just do that!
    if (nextToDestination(currentState, currentDestination)) {
      // Was this the last destination?
      if (currentState.destinationsRemaining.length == 1) {
        const stepsTakenToReachEnd = currentState.stepsTaken + 1;

        if (stepsTakenToReachEnd < stepsToEnd) {
          console.log(iterations);
          console.log(
            'New shortest distance to end of ' + stepsTakenToReachEnd
          );
          stepsToEnd = stepsTakenToReachEnd;
        } else {
          // Is this now unreachable because we'll prune before this point?
          console.log(
            'Reached the end but in an equal or higher time of ' +
              stepsTakenToReachEnd
          );
        }
      } else {
        // Still got more legs to go! Add the next state for this destination.
        const destination = currentState.destinationsRemaining.shift()!;

        console.log(
          `Reached a destination on step ${currentState.stepsTaken + 1}`
        );
        states = [];
        states.unshift({
          stepsTaken: currentState.stepsTaken + 1,
          distanceToEnd: manhattanDistance(
            destination,
            currentState.destinationsRemaining[0]
          ),
          position: destination,
          destinationsRemaining: [...currentState.destinationsRemaining],
        });
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

      // Maintain queue where moves that are closest to the end are at the front and then by lowest
      // step count
      states.sort((a, b) =>
        a.stepsTaken < b.stepsTaken
          ? -1
          : a.stepsTaken == b.stepsTaken
          ? a.distanceToEnd < b.distanceToEnd
            ? -1
            : 1
          : 1
      );
    }
  }
};

start();
