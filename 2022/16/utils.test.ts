import { RoomMap, RouteMap } from './types';
import { collapseAllRoutes, optimizeRouteMap } from './utils';

describe('optimizeRouteMap', () => {
  test('remove single node', () => {
    // Test to remove a single zero-node between two nodes. Result should be the two
    // remaining nodes joined together with a moveCost of 2

    const rooms: RoomMap = new Map(
      [
        { name: 'A', flowRate: 1 },
        { name: 'ToRemove', flowRate: 0 },
        { name: 'Z', flowRate: 1 },
      ].map((x) => [x.name, x])
    );

    const routeMap: RouteMap = new Map([
      ['A', [{ moveCost: 1, toRoomName: 'ToRemove' }]],
      [
        'ToRemove',
        [
          { moveCost: 1, toRoomName: 'A' },
          { moveCost: 1, toRoomName: 'Z' },
        ],
      ],
      ['Z', [{ moveCost: 1, toRoomName: 'ToRemove' }]],
    ]);

    optimizeRouteMap(routeMap, rooms);

    expect(routeMap.size).toEqual(2);
    expect(routeMap.get('A')).toEqual([{ moveCost: 2, toRoomName: 'Z' }]);
    expect(routeMap.get('Z')).toEqual([{ moveCost: 2, toRoomName: 'A' }]);
  });

  test('remove two nodes', () => {
    // Test to remove a two zero-nodes between two nodes. Result should be the two
    // remaining nodes joined together but with a moveCost of 3.

    const rooms: RoomMap = new Map(
      [
        { name: 'A', flowRate: 1 },
        { name: 'ToRemove1', flowRate: 0 },
        { name: 'ToRemove2', flowRate: 0 },
        { name: 'Z', flowRate: 1 },
      ].map((x) => [x.name, x])
    );

    const routeMap: RouteMap = new Map([
      ['A', [{ moveCost: 1, toRoomName: 'ToRemove1' }]],
      [
        'ToRemove1',
        [
          { moveCost: 1, toRoomName: 'A' },
          { moveCost: 1, toRoomName: 'ToRemove2' },
        ],
      ],
      [
        'ToRemove2',
        [
          { moveCost: 1, toRoomName: 'ToRemove1' },
          { moveCost: 1, toRoomName: 'Z' },
        ],
      ],
      ['Z', [{ moveCost: 1, toRoomName: 'ToRemove2' }]],
    ]);

    optimizeRouteMap(routeMap, rooms);

    expect(routeMap.size).toEqual(2);
    expect(routeMap.get('A')).toEqual([{ moveCost: 3, toRoomName: 'Z' }]);
    expect(routeMap.get('Z')).toEqual([{ moveCost: 3, toRoomName: 'A' }]);
  });

  test('remove slow routes', () => {
    // If after optimizing, there are multiple routes from one room to another,
    // only keep the quickest route.

    const rooms: RoomMap = new Map(
      [
        { name: 'A', flowRate: 1 },
        { name: 'ToRemove1', flowRate: 0 },
        { name: 'ToRemove2', flowRate: 0 },
        { name: 'ToRemove3', flowRate: 0 },
        { name: 'Z', flowRate: 1 },
      ].map((x) => [x.name, x])
    );

    const routeMap: RouteMap = new Map([
      [
        'A',
        [
          { moveCost: 1, toRoomName: 'ToRemove1' },
          { moveCost: 1, toRoomName: 'ToRemove3' },
        ],
      ],
      [
        'ToRemove1',
        [
          { moveCost: 1, toRoomName: 'A' },
          { moveCost: 1, toRoomName: 'ToRemove2' },
        ],
      ],
      [
        'ToRemove2',
        [
          { moveCost: 1, toRoomName: 'ToRemove1' },
          { moveCost: 1, toRoomName: 'Z' },
        ],
      ],
      [
        'ToRemove3',
        [
          { moveCost: 1, toRoomName: 'A' },
          { moveCost: 1, toRoomName: 'Z' },
        ],
      ],
      [
        'Z',
        [
          { moveCost: 1, toRoomName: 'ToRemove2' },
          { moveCost: 1, toRoomName: 'ToRemove3' },
        ],
      ],
    ]);

    optimizeRouteMap(routeMap, rooms);

    console.log(routeMap);

    expect(routeMap.size).toEqual(2);
    expect(routeMap.get('A')).toEqual([{ moveCost: 2, toRoomName: 'Z' }]);
    expect(routeMap.get('Z')).toEqual([{ moveCost: 2, toRoomName: 'A' }]);
  });

  test('remove dangling zero-node', () => {
    // Test to remove a single zero-node that is not connected to anything else.

    const rooms: RoomMap = new Map(
      [
        { name: 'A', flowRate: 1 },
        { name: 'ToRemove', flowRate: 0 },
      ].map((x) => [x.name, x])
    );

    const routeMap: RouteMap = new Map([
      ['A', [{ moveCost: 1, toRoomName: 'ToRemove' }]],
      ['ToRemove', [{ moveCost: 1, toRoomName: 'A' }]],
    ]);

    optimizeRouteMap(routeMap, rooms);

    expect(routeMap.size).toEqual(1);
    expect(routeMap.get('A')).toEqual([]);
  });

  test('keep room AA', () => {
    // AA is the start room and though it is a zero node, it shouldn't be removed.

    const rooms: RoomMap = new Map(
      [
        { name: 'AA', flowRate: 0 },
        { name: 'ToRemove', flowRate: 0 },
        { name: 'Z', flowRate: 1 },
      ].map((x) => [x.name, x])
    );

    const routeMap: RouteMap = new Map([
      ['AA', [{ moveCost: 1, toRoomName: 'ToRemove' }]],
      [
        'ToRemove',
        [
          { moveCost: 1, toRoomName: 'AA' },
          { moveCost: 1, toRoomName: 'Z' },
        ],
      ],
      ['Z', [{ moveCost: 1, toRoomName: 'ToRemove' }]],
    ]);

    optimizeRouteMap(routeMap, rooms);

    expect(routeMap.size).toEqual(2);
    expect(routeMap.get('AA')).toEqual([{ moveCost: 2, toRoomName: 'Z' }]);
    expect(routeMap.get('Z')).toEqual([{ moveCost: 2, toRoomName: 'AA' }]);
  });
});

describe('collapseAllRoutes', () => {
  test('3 node test', () => {
    const rooms: RoomMap = new Map(
      [
        { name: 'A', flowRate: 1 },
        { name: 'B', flowRate: 1 },
        { name: 'C', flowRate: 1 },
      ].map((x) => [x.name, x])
    );

    const routeMap: RouteMap = new Map([
      ['A', [{ moveCost: 1, toRoomName: 'B' }]],
      [
        'B',
        [
          { moveCost: 1, toRoomName: 'A' },
          { moveCost: 1, toRoomName: 'C' },
        ],
      ],
      ['C', [{ moveCost: 1, toRoomName: 'B' }]],
    ]);

    collapseAllRoutes(routeMap, rooms);

    expect(routeMap.size).toEqual(3);

    expect(routeMap.get('A')).toEqual([
      { moveCost: 1, toRoomName: 'B' },
      { moveCost: 2, toRoomName: 'C' },
    ]);
    expect(routeMap.get('B')).toEqual([
      { moveCost: 1, toRoomName: 'A' },
      { moveCost: 1, toRoomName: 'C' },
    ]);
    expect(routeMap.get('C')).toEqual([
      { moveCost: 1, toRoomName: 'B' },
      { moveCost: 2, toRoomName: 'A' },
    ]);
  });
});
