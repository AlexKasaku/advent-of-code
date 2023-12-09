import fs from 'fs';
import path from 'path';
import { buildNetwork, parseInput } from './utils';
import { Node } from './types';
import getPrimeFactors from '@utils/getPrimeFactors';
import buildPrimeArray from '@utils/buildPrimeArray';

const debugMode = true;
const debug = (...params: any[]) => debugMode && console.log(...params);
const log = (...params: any[]) => console.log(...params);

const part1 = (steps: string, nodes: Map<string, Node>) => {
  let currentNode = nodes.get('AAA')!;
  let step = 0;

  while (currentNode.id != 'ZZZ') {
    const oldNodeId = currentNode.id;

    const nextStep = steps[step % steps.length];
    if (nextStep === 'L') currentNode = currentNode.left!;
    else currentNode = currentNode.right!;

    debug(`${oldNodeId} => ${currentNode.id}`);

    step++;
  }

  log(step);
};

const part2 = (steps: string, nodes: Map<string, Node>) => {
  const currentNodes = [...nodes.values()].filter((n) => n.id.endsWith('A'));
  let step = 0;

  debug(currentNodes);

  // Determine first time each node loops
  const loopsAt = [...new Array(currentNodes.length)].fill(0);
  while (loopsAt.some((l) => l === 0)) {
    const nextStep = steps[step % steps.length];

    for (
      let currentNodeIndex = 0;
      currentNodeIndex < currentNodes.length;
      currentNodeIndex++
    ) {
      const thisNode = currentNodes[currentNodeIndex];
      currentNodes[currentNodeIndex] =
        nextStep === 'L' ? thisNode.left! : thisNode.right!;

      const newNode = currentNodes[currentNodeIndex];
      if (newNode.id.endsWith('Z') && loopsAt[currentNodeIndex] === 0)
        loopsAt[currentNodeIndex] = step + 1;
    }
    step++;
  }

  log(loopsAt);

  // We've got the looping positions, find lowest common multiple. Assumes
  // prime factors won't go above 1000;
  const primes = buildPrimeArray(1000);
  const primeFactors = loopsAt.map((l) => getPrimeFactors(l, primes));
  const uniquePrimeFactors = [...new Set(primeFactors.flat())];
  log(uniquePrimeFactors);

  const lowestCommonMultiple = uniquePrimeFactors.reduce((a, b) => a * b, 1);

  log(lowestCommonMultiple);
};

const start = async (file: string) => {
  const content = fs.readFileSync(path.join(__dirname, file), 'utf8');

  const instructions = parseInput(content);
  const nodes = buildNetwork(instructions.map);

  //part1(instructions.steps, nodes);
  part2(instructions.steps, nodes);
};

//start('./files/example.txt');
//start('./files/example2.txt');
//start('./files/example.part2.txt');
start('./files/input.txt');
