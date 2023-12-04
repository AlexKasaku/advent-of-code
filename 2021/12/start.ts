import fs from 'fs';
import path from 'path';
import { State } from './types';
import { parseInput } from './utils';

//const file = './files/example.txt';
//const file = './files/example.2.txt';
//const file = './files/example.3.txt';
const file = './files/input.txt';

const start = async () => {
  const content = fs.readFileSync(path.join(__dirname, file), 'utf8');

  const roomMap = parseInput(content);

  const stack: State[] = [
    {
      room: 'start',
      visited: new Set<string>(),
      visitedSmallCaveTwice: false,
      route: 'start',
    },
  ];

  const routes = new Set<string>();

  while (stack.length > 0) {
    const state = stack.pop()!;

    if (state.room === 'end') {
      // This is the end, write out how we got here.
      //console.log([...state.visited].join(',') + ',end');
      routes.add(state.route);
    } else {
      const nextRooms = roomMap
        .get(state.room)!
        .connected.filter(
          (r) =>
            r !== 'start' &&
            (!state.visited.has(r) ||
              !state.visitedSmallCaveTwice ||
              roomMap.get(r)!.big),
        )
        .map((room) => {
          const visitedSmallCaveTwice =
            state.visitedSmallCaveTwice ||
            (state.visited.has(room) && !roomMap.get(room)!.big);

          const visited = new Set([...state.visited, room]);

          return {
            room,
            visited,
            visitedSmallCaveTwice,
            route: `${state.route},${room}`,
          };
        });

      stack.push(...nextRooms);
    }
  }

  console.log(routes);
};

start();
