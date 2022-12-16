import findAndRemove from '@utils/findAndRemove';
import { EOL } from 'os';
import { RoomMap, Route, RouteMap } from './types';

export const parseInput = (content: string) => {
  // Regex for: Valve AA has flow rate=0; tunnels lead to valves DD, II, BB
  return content.split(EOL).map((line) => {
    const lineRegex =
      /(?<name>[A-Z]{2}) has flow rate=(?<flowRate>\d+); tunnel(s)? lead(s)? to valve(s)? (?<tunnels>.+)/gi;

    const match = lineRegex.exec(line);

    if (!match || !match.groups)
      throw 'Could not parse input for line: [' + line + ']';

    const { name, flowRate, tunnels } = match.groups;
    return {
      room: { name, flowRate: parseInt(flowRate) },
      tunnelsTo: tunnels.split(', '),
    };
  });
};

export const optimizeRouteMap = (routeMap: RouteMap, rooms: RoomMap) => {
  // Optimize the route map by removing all 0 flowrate rooms, since
  // we never stop in these.

  // We want to find all 0 rooms, remove them from the route map and join up routes either side with an increased cost.
  for (const zeroRoom of [...rooms.values()].filter(
    (r) => r.flowRate === 0 && r.name != 'AA'
  )) {
    // Get all the routes for this room
    const routes = routeMap.get(zeroRoom.name);

    if (!routes) throw 'Could not find routes for room: ' + zeroRoom.name;

    for (const route of routes) {
      // Take all the other routes besides this one and add 1 cost to them.
      const routesToAdd: Route[] = [
        ...routes
          .filter((r) => r.toRoomName != route.toRoomName)
          .map(({ moveCost, toRoomName }) => ({
            moveCost: moveCost + route.moveCost,
            toRoomName,
          })),
      ];

      const destinationRoomRoutes = routeMap.get(route.toRoomName);

      if (!destinationRoomRoutes)
        throw 'Could not find routes for room: ' + route.toRoomName;

      // Now push that to this route destination to join them up, if they
      // are more efficent than existing routes
      for (const routeToAdd of routesToAdd) {
        const existingRoute = destinationRoomRoutes.find(
          (r) => r.toRoomName == routeToAdd.toRoomName
        );

        if (!existingRoute) destinationRoomRoutes.push(routeToAdd);
        else if (routeToAdd.moveCost < existingRoute.moveCost)
          existingRoute.moveCost = routeToAdd.moveCost;
      }

      // And remove the route from there to the zero room
      findAndRemove(
        destinationRoomRoutes,
        (r) => r.toRoomName == zeroRoom.name
      );
    }

    // Finally remove all routes for the zero room
    routeMap.delete(zeroRoom.name);
  }
};

export const collapseAllRoutes = (routeMap: RouteMap, rooms: RoomMap) => {
  // Collapse all routes so we know the distance from each room to
  // each other room.

  // To do this we will walk the graph and add connections as we find them, starting from 'AA'.
  const visited = new Set<string>();

  for (const [roomName, routes] of routeMap.entries()) {
    for (const route of routes) {
      // Take all the other routes besides this one and add 1 cost to them.
      const routesToAdd: Route[] = [
        ...routes
          .filter((r) => r.toRoomName != route.toRoomName)
          .map(({ moveCost, toRoomName }) => ({
            moveCost: moveCost + route.moveCost,
            toRoomName,
          })),
      ];

      const destinationRoomRoutes = routeMap.get(route.toRoomName);

      if (!destinationRoomRoutes)
        throw 'Could not find routes for room: ' + route.toRoomName;

      // Now push that to this route destination to join them up, if they
      // are more efficent than existing routes
      for (const routeToAdd of routesToAdd) {
        const existingRoute = destinationRoomRoutes.find(
          (r) => r.toRoomName == routeToAdd.toRoomName
        );

        if (!existingRoute) destinationRoomRoutes.push(routeToAdd);
        else if (routeToAdd.moveCost < existingRoute.moveCost)
          existingRoute.moveCost = routeToAdd.moveCost;
      }
    }
  }
};
