import fs from 'fs';
import path from 'path';
import {
  parseInput,
  positionPairKeyWithStrings,
  reduceGridToGraph,
} from './utils';
import priorityQueue from '@utils/priorityQueue';

const debugMode = false;
const debug = (...params: any[]) => debugMode && console.log(...params);
const log = (...params: any[]) => console.log(...params);

type Route = {
  node: string;
  visited: Set<string>;
  distance: number;
};

const start = async (file: string) => {
  const content = fs.readFileSync(path.join(__dirname, file), 'utf8');
  const grid = parseInput(content);

  // Part 1
  //const allowUphills = false;

  // Part 2
  const allowUphills = true;

  const { start, end, nodePairWeights, nodePairs } = reduceGridToGraph(
    grid,
    allowUphills,
  );

  // We have a graph, nodes represent crossings. Crossings can never be visited more than once otherwise
  // we would back track. Find the highest distance to reach the end.

  let maxDistance = 0;
  // Prioritise queue by which has the greatest distance travelled
  const queue = priorityQueue<Route>((a, b) => a.distance > b.distance);
  queue.insert({
    node: start,
    visited: new Set<string>(),
    distance: 0,
  });

  while (!queue.isEmpty()) {
    const { node, visited, distance } = queue.dequeue()!;

    if (node === end) {
      // Reached end. What's our score?
      if (distance > maxDistance) {
        log(`Total distance: ${distance}`);
        maxDistance = distance;
      }
    } else {
      // Find all node pairs that we haven't yet visited
      const destNodes = [...nodePairs.get(node)!].filter(
        (n) => !visited.has(n),
      );

      destNodes.forEach((n) => {
        queue.insert({
          node: n,
          visited: new Set<string>([...visited, n]),
          distance:
            distance +
            nodePairWeights.get(positionPairKeyWithStrings(node, n))!,
        });
      });
    }
  }
};

//start('./files/example.txt');
start('./files/input.txt');
