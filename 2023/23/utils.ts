import { Grid, Position } from '@utils/grid';
import { EOL } from 'os';
import { Graph, Space } from './types';

export const parseInput = (input: string): Grid<Space> => {
  const values = input.split(EOL).map((line) => line.split(''));

  return new Grid<Space>(values.length, values[0].length, ({ x, y }) => ({
    x,
    y,
    char: values[y][x],
    isWall: values[y][x] === '#',
  }));
};

export const positionKey = ({ x, y }: Position): string => `${x},${y}`;
export const positionPairKey = (
  { x: x1, y: y1 }: Position,
  { x: x2, y: y2 }: Position,
): string => `${x1},${y1}-->${x2},${y2}`;
export const positionPairKeyWithStrings = (
  node1: string,
  node2: string,
): string => `${node1}-->${node2}`;

const isUphill = (position: Position, newPosition: Space) => {
  if (newPosition.y < position.y && newPosition.char === 'v') return true;
  if (newPosition.x < position.x && newPosition.char === '>') return true;
  return false;
};

// Turn the whole maze into a graph for faster processing. As we only need this for part 2, we ignore
// all slopes.
// Possible Todo: This builds the graph but there's definitely some inefficiences here, it should be quicker.
export const reduceGridToGraph = (
  grid: Grid<Space>,
  allowUphills: boolean,
): Graph => {
  const start = grid.Values[0].find((s) => !s.isWall)!;
  const end = grid.Values[grid.Values.length - 1].find((s) => !s.isWall)!;

  // A node is any crossing, and the start and end
  const startKey = positionKey(start);
  const endKey = positionKey(end);

  const nodes = new Set<string>([startKey, endKey]);
  const nodePairWeights = new Map<string, number>();
  const nodePairs = new Map<string, Set<string>>([
    [startKey, new Set<string>()],
    [endKey, new Set<string>()],
  ]);

  // Walk from start until at end. We want to find *all* node pairs.
  type Route = {
    distanceSinceLastNode: number;
    lastNodePosition: Position;
    position: Position;
    visited: Set<Position>;
  };

  const queue: Route[] = [
    {
      distanceSinceLastNode: 0,
      lastNodePosition: start,
      position: start,
      visited: new Set<Position>(),
    },
  ];

  // Can't short cut as we need to build entire graph
  while (queue.length > 0) {
    // eslint-disable-next-line prefer-const
    let { lastNodePosition, distanceSinceLastNode, position, visited } =
      queue.shift()!;

    if (position === end) {
      // Reached end. Add current pair on for the end
      const lastNodePositionKey = positionKey(lastNodePosition);
      nodePairs.get(lastNodePositionKey)!.add(endKey);
      nodePairWeights.set(
        positionPairKey(end, lastNodePosition),
        distanceSinceLastNode,
      );
      nodePairs.get(endKey)!.add(lastNodePositionKey);
      nodePairWeights.set(
        positionPairKey(lastNodePosition, end),
        distanceSinceLastNode,
      );
      continue;
    }

    const neighbours = grid
      .getNeighbours(position, true)
      .filter((s) => !s.isWall && (allowUphills || !isUphill(position, s)));

    if (neighbours.length > 2) {
      // We have more than two neighbours, this is a crossing! Record this as a pair.
      // We might have visited this position and also this pair, because we might have
      // come from the other direction - but the values should be the same
      const thisPositionKey = positionKey(position);
      const lastNodePositionKey = positionKey(lastNodePosition);

      nodes.add(thisPositionKey);
      if (!nodePairs.get(thisPositionKey))
        nodePairs.set(thisPositionKey, new Set<string>());

      if (nodePairWeights.get(positionPairKey(position, lastNodePosition))) {
        // We've visited this node from the other direction, let's not go any further, this
        // will greatly speed up graph
        continue;
      }

      // Add the pairings + weights
      nodePairs.get(thisPositionKey)!.add(lastNodePositionKey);
      nodePairWeights.set(
        positionPairKey(position, lastNodePosition),
        distanceSinceLastNode,
      );
      nodePairs.get(lastNodePositionKey)!.add(thisPositionKey);
      nodePairWeights.set(
        positionPairKey(lastNodePosition, position),
        distanceSinceLastNode,
      );

      // Reset state to mark this as last position
      lastNodePosition = position;
      distanceSinceLastNode = 0;

      // If we've already found as many pairs for this crossing as there are neighbours, don't bother
      // going any further
      if (
        [...nodePairWeights.keys()].filter((f) =>
          f.startsWith(positionKey(position)),
        ).length === neighbours.length
      )
        continue;
    }

    // Find all neighbours that: aren't walls, we haven't yet visited, aren't uphill
    const unvisitedNeighbours = neighbours.filter((s) => !visited.has(s));

    unvisitedNeighbours.forEach((n) => {
      const route: Route = {
        lastNodePosition,
        distanceSinceLastNode: distanceSinceLastNode + 1,
        position: n,
        visited: new Set<Position>([...visited, position]),
      };

      queue.push(route);
    });
  }

  return {
    start: startKey,
    end: endKey,
    nodes,
    nodePairs,
    nodePairWeights,
  };
};
