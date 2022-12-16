import fs from 'fs';
import path from 'path';
import { RoomMap, RouteMap } from './types';
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
    ])
  );

  console.log(rooms);

  // Optimize route map by removing 0 nodes (except AA)
  optimizeRouteMap(routeMap, rooms);

  // Collapse all routes so we know the distance between any two rooms
  collapseAllRoutes(routeMap, rooms);

  console.log(routeMap);

  const timeRemaining = 30;
  const turnedOnRooms = new Set<string>();

  const value = findBestRoute(
    'AA',
    timeRemaining,
    turnedOnRooms,
    rooms,
    routeMap
  );

  console.log(value);
};

const findBestRoute = (
  thisRoomName: string,
  timeRemaining: number,
  turnedOnRooms: Set<string>,
  rooms: RoomMap,
  routeMap: RouteMap
): number => {
  // Check time remaining
  if (timeRemaining < 0) return 0;

  // Get room
  const room = rooms.get(thisRoomName)!;

  // Enable this room (if not AA)
  const flow = room.flowRate > 0 ? room.flowRate * --timeRemaining : 0;

  const turnedOnRoomsNew = new Set([...turnedOnRooms, thisRoomName]);

  // console.log(
  //   `Current room: ${thisRoomName}. Flow of this room: ${flow}. Time remaining: ${timeRemaining}`
  // );
  // console.log(turnedOnRoomsNew);

  const roomsFromHere = routeMap
    .get(thisRoomName)!
    .filter((route) => !turnedOnRoomsNew.has(route.toRoomName))
    .map((route) =>
      findBestRoute(
        route.toRoomName,
        timeRemaining - route.moveCost,
        turnedOnRoomsNew,
        rooms,
        routeMap
      )
    );

  return roomsFromHere.length ? flow + Math.max(...roomsFromHere) : flow;
};

start();
