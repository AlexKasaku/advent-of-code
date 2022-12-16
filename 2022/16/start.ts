import fs from 'fs';
import path from 'path';
import { RoomMap, RouteMap } from './types';
import { optimizeRouteMap, parseInput } from './utils';

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
  console.log(routeMap);

  // Optimize route map by removing 0 nodes (except AA)
  optimizeRouteMap(routeMap, rooms);

  console.log(routeMap);
};

start();
