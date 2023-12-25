import fs from 'fs';
import path from 'path';
import { buildGraph, kargerMinimumCut, parseInput } from './utils';

const debugMode = false;
const debug = (...params: any[]) => debugMode && console.log(...params);
const log = (...params: any[]) => console.log(...params);

const start = async (file: string) => {
  const content = fs.readFileSync(path.join(__dirname, file), 'utf8');

  const edgeInput = parseInput(content);
  const graph = buildGraph(edgeInput);

  let minimumEdges = 10;

  do {
    const cuts = kargerMinimumCut(graph);

    if (cuts.edgesLeft < minimumEdges) {
      minimumEdges = cuts.edgesLeft;
      log(cuts.edgesLeft);
      log(cuts.group1.length * cuts.group2.length);

      log('--------------------------');
    }
  } while (minimumEdges > 3);
};

//start('./files/example.txt');
start('./files/input.txt');
