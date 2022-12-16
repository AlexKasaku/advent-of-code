import fs from 'fs';
import path from 'path';
import { RoomMap, RouteMap } from './types';
import { collapseAllRoutes, optimizeRouteMap, parseInput } from './utils';

const file = './files/example.txt';
//const file = './files/input.txt';

const start = async () => {
  const content = fs.readFileSync(path.join(__dirname, file), 'utf8');

  const parsedInput = parseInput(content);

  // Parse the input into the set of Rooms and routes
  const rooms: RoomMap = new Map(parsedInput.map((r) => [r.room.name, r.room]));
  const routeMap: RouteMap = new Map(
    parsedInput.map((i) => [
      i.room.name,
      i.tunnelsTo.map((t) => ({ moveCost: 1, toRoomName: t })),
    ])
  );

  console.log(rooms);

  // Optimize route map by removing 0 nodes (except AA)
  optimizeRouteMap(routeMap, rooms);

  // Collapse all routes so we know the distance between any two rooms
  collapseAllRoutes(routeMap, rooms);

  console.log(routeMap);

  const timeRemaining = 26;
  const turnedOnRooms = new Set<string>();

  const value = findBestRoute(
    { me: 'AA', elephant: 'AA' },
    { me: timeRemaining, elephant: timeRemaining },
    turnedOnRooms,
    rooms,
    routeMap
  );

  console.log(value);
};

type Combo<T> = { me: T; elephant: T };

const findBestRoute = (
  roomCombo: Combo<string | null>,
  timeRemaining: Combo<number>,
  turnedOnRooms: Set<string>,
  rooms: RoomMap,
  routeMap: RouteMap
): number => {
  // Check time remaining on each
  console.log(`Have moved to: ${JSON.stringify(roomCombo)}`);

  let totalFlow = 0;
  const turnedOnRoomsNew = new Set([...turnedOnRooms]);

  if (timeRemaining.me > 0 && roomCombo.me != null) {
    // Get room
    const room = rooms.get(roomCombo.me)!;

    // Enable this room (if not AA)
    const flow = room.flowRate > 0 ? room.flowRate * --timeRemaining.me : 0;

    turnedOnRoomsNew.add(roomCombo.me);

    totalFlow += flow;
  }

  if (timeRemaining.elephant > 0 && roomCombo.elephant != null) {
    // Get room
    const room = rooms.get(roomCombo.elephant)!;

    // Enable this room (if not AA)
    const flow =
      room.flowRate > 0 ? room.flowRate * --timeRemaining.elephant : 0;

    turnedOnRoomsNew.add(roomCombo.elephant);

    totalFlow += flow;
  }

  console.log(
    `Turned on: ${[...turnedOnRooms.values()]}. Total flow: ${totalFlow}`
  );

  // console.log(
  //   `Current room: ${thisRoomName}. Flow of this room: ${flow}. Time remaining: ${timeRemaining}`
  // );
  // console.log(turnedOnRoomsNew);

  // Get our next room options, don't take an option if it is cheaper for the other
  const routeMapFromMe =
    roomCombo.me != null ? routeMap.get(roomCombo.me)! : [];
  const routeMapFromElephant =
    roomCombo.elephant != null ? routeMap.get(roomCombo.elephant)! : [];

  // const roomOptionsMe =
  //   roomCombo.me != null
  //     ? routeMapFromMe.filter(
  //         (route) =>
  //           !turnedOnRoomsNew.has(route.toRoomName) &&
  //           route.moveCost <=
  //             (routeMapFromElephant.find(
  //               (r) => r.toRoomName == route.toRoomName
  //             )?.moveCost ?? Infinity)
  //       )
  //     : [];

  // const roomOptionsElephant =
  //   roomCombo.elephant != null
  //     ? routeMapFromElephant.filter(
  //         (route) =>
  //           !turnedOnRoomsNew.has(route.toRoomName) &&
  //           route.moveCost <=
  //             (routeMapFromMe.find((r) => r.toRoomName == route.toRoomName)
  //               ?.moveCost ?? Infinity)
  //       )
  //     : [];

  const roomOptionsMe =
    roomCombo.me != null
      ? routeMapFromMe.filter(
          (route) => !turnedOnRoomsNew.has(route.toRoomName)
        )
      : [];

  const roomOptionsElephant =
    roomCombo.elephant != null
      ? routeMapFromElephant.filter(
          (route) => !turnedOnRoomsNew.has(route.toRoomName)
        )
      : [];

  let remainingCombos = [];

  if (roomCombo.me == null && roomCombo.elephant == null) {
    // No more options left
    return totalFlow;
  } else if (roomCombo.me == null) {
    // I'm stuck, elephant still has options
    remainingCombos = roomOptionsElephant.map((option) => ({
      me: null,
      elephant: option,
    }));
  } else if (roomCombo.elephant == null) {
    // He's stuck, I still have options
    remainingCombos = roomOptionsMe.map((option) => ({
      me: option,
      elephant: null,
    }));
  } else {
    // Create a matrix of all room combos of us. Skip any combos where we both go to same
    // room which can happen if the cost was the same.
    remainingCombos = roomOptionsMe
      .flatMap((meOption) =>
        roomOptionsElephant.map((elephantOption) => ({
          me: meOption,
          elephant: elephantOption,
        }))
      )
      .filter((combo) => combo.me.toRoomName != combo.elephant.toRoomName);
  }

  console.log(remainingCombos);

  const roomsFromHere = remainingCombos.map((combo) =>
    findBestRoute(
      {
        me: combo.me?.toRoomName ?? null,
        elephant: combo.elephant?.toRoomName ?? null,
      },
      {
        me: combo.me != null ? timeRemaining.me - combo.me.moveCost : 0,
        elephant:
          combo.elephant != null
            ? timeRemaining.elephant - combo.elephant.moveCost
            : 0,
      },
      turnedOnRoomsNew,
      rooms,
      routeMap
    )
  );

  const highest = Math.max(...roomsFromHere, 0);
  console.log(`Highest sub-route was ${highest}, adding to ${totalFlow}`);

  return roomsFromHere.length ? totalFlow + highest : totalFlow;
};

start();
