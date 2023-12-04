import fs from 'fs';
import path from 'path';
import { Combo, RoomMap, Route, RouteMap, RouteState } from './types';
import { collapseAllRoutes, optimizeRouteMap, parseInput } from './utils';

//const file = './files/example.txt';
const file = './files/input.txt';

const start = async () => {
  const content = fs.readFileSync(path.join(__dirname, file), 'utf8');

  const parsedInput = parseInput(content);

  // Parse the input into the set of Rooms and routes
  const rooms: RoomMap = new Map(parsedInput.map((r) => [r.room.name, r.room]));
  const routeMap: RouteMap = new Map(
    parsedInput.map((i) => [
      i.room.name,
      i.tunnelsTo.map((t) => ({ moveCost: 1, toRoomName: t })),
    ]),
  );

  console.log(rooms);

  // Optimize route map by removing 0 nodes (except AA)
  optimizeRouteMap(routeMap, rooms);

  // Collapse all routes so we know the distance between any two rooms
  collapseAllRoutes(routeMap, rooms);

  console.log(routeMap);

  const timeRemaining = 26;

  const visitStack: RouteState[] = [
    {
      room: { me: 'AA', elephant: 'AA' },
      timeRemaining: { me: timeRemaining, elephant: timeRemaining },
      currentFlowRate: 0,
      roomsTurnedOn: new Map<string, string>(),
    },
  ];

  let highestFlowRate = 0;

  while (visitStack.length > 0) {
    // Pop latest off stack and using that context:
    const currentState = visitStack.pop()!;

    // Create new set of rooms turned on so we have a separate object
    const turnedOnRoomsFromHere = new Map([...currentState.roomsTurnedOn]);
    let currentFlowRate = currentState.currentFlowRate;
    const timeRemaining = {
      me: currentState.timeRemaining.me,
      elephant: currentState.timeRemaining.elephant,
    };

    // Calculate flowRate for me in this room, if I'm in a room
    if (currentState.room.me != null && currentState.room.me != 'AA') {
      // Get room
      const room = rooms.get(currentState.room.me)!;

      // Calculate flowRate for turning this room on. This uses up 1 unit of time.
      timeRemaining.me--;
      const flow = room.flowRate * timeRemaining.me;

      turnedOnRoomsFromHere.set(room.name, `me w/ ${flow}`);

      currentFlowRate += flow;
    }

    // Calculate flowRate for elephant in this room, if he's in a room
    if (
      currentState.room.elephant != null &&
      currentState.room.elephant != 'AA'
    ) {
      // Get room
      const room = rooms.get(currentState.room.elephant)!;

      // Calculate flowRate for turning this room on. This uses up 1 unit of time.
      timeRemaining.elephant--;
      const flow = room.flowRate * timeRemaining.elephant;

      turnedOnRoomsFromHere.set(room.name, `elephant w/ ${flow}`);

      currentFlowRate += flow;
    }

    // If any combos remaining, add all next combos to the stack that there is time remaining for
    const remainingCombos = findRemainingRoomCombos(
      currentState.room,
      timeRemaining,
      turnedOnRoomsFromHere,
      routeMap,
    );
    //console.log(remainingCombos);

    if (remainingCombos.length > 0) {
      // Push all to the stack
      remainingCombos.forEach((combo) => {
        visitStack.push({
          room: {
            me: combo.me?.toRoomName ?? null,
            elephant: combo.elephant?.toRoomName ?? null,
          },
          timeRemaining: {
            me: combo.me != null ? timeRemaining.me - combo.me.moveCost : 0,
            elephant:
              combo.elephant != null
                ? timeRemaining.elephant - combo.elephant?.moveCost
                : 0,
          },
          currentFlowRate,
          roomsTurnedOn: turnedOnRoomsFromHere,
        });
      });
    } else {
      // If no combos left, add current value and push out to route list.
      if (currentFlowRate > highestFlowRate) {
        highestFlowRate = currentFlowRate;
        console.log(
          `Rooms: ${JSON.stringify([
            ...turnedOnRoomsFromHere.entries(),
          ])} time remaining: ${JSON.stringify(
            timeRemaining,
          )}, flow rate: ${currentFlowRate}`,
        );
      }
    }
  }

  // Submitted: 2492, too low. Finished in 4239s due to console outputs! 94s if console outputs only for new highest.
  // Submitted: 2502, too low.
  // Submitted: 2549 based on adding up reported best route.

  console.log(highestFlowRate);
};

const findRemainingRoomCombos = (
  room: Combo<string | null>,
  timeRemaining: Combo<number>,
  roomsTurnedOn: Map<string, string>,
  routeMap: RouteMap,
) => {
  const routeMapFromMe = room.me != null ? routeMap.get(room.me)! : [];
  const routeMapFromElephant =
    room.elephant != null ? routeMap.get(room.elephant)! : [];

  // Get rooms I can move to. This is all rooms that haven't already been visited
  // and that I can get to and enable in the time remaining with at least 1 minute left
  // after (otherwise enabling this will give 0 flow so be useless)
  const roomOptionsMe =
    room.me != null
      ? routeMapFromMe.filter(
          (route) =>
            !roomsTurnedOn.has(route.toRoomName) &&
            timeRemaining.me >= route.moveCost + 2,
        )
      : [];

  // Repeat for elephant
  const roomOptionsElephant =
    room.elephant != null
      ? routeMapFromElephant.filter(
          (route) =>
            !roomsTurnedOn.has(route.toRoomName) &&
            timeRemaining.elephant >= route.moveCost + 2,
        )
      : [];

  let remainingCombos: Combo<Route | null>[] = [];

  if (room.me == null && room.elephant == null) {
    // No more options left
  } else if (room.me == null || roomOptionsMe.length == 0) {
    // I'm stuck, elephant still has options
    remainingCombos = roomOptionsElephant.map((option) => ({
      me: null,
      elephant: option,
    }));
    // console.log(
    //   `Elephant can still move to ${remainingCombos.length} locations`
    // );
  } else if (room.elephant == null || roomOptionsElephant.length == 0) {
    // He's stuck, I still have options
    remainingCombos = roomOptionsMe.map((option) => ({
      me: option,
      elephant: null,
    }));
  } else {
    // Create a matrix of all room combos of us. Skip any combos where we both go to same room.
    remainingCombos = roomOptionsMe
      .flatMap((meOption) =>
        roomOptionsElephant.map((elephantOption) => ({
          me: meOption,
          elephant: elephantOption,
        })),
      )
      .filter((combo) => combo.me.toRoomName != combo.elephant.toRoomName);
  }
  return remainingCombos;
};

start();
