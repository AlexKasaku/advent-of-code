import fs from 'fs';
import path from 'path';
import { buildNetwork, parseInput } from './utils';

const debugMode = false;
const debug = (...params: any[]) => debugMode && console.log(...params);
const log = (...params: any[]) => console.log(...params);

const start = async (file: string) => {
  const content = fs.readFileSync(path.join(__dirname, file), 'utf8');

  const instructions = parseInput(content);
  const nodes = buildNetwork(instructions.map);

  // Part 1 - Follow instructions
  let currentNode = nodes.get('AAA')!;
  let step = 0;

  while (currentNode.id != 'ZZZ') {
    const oldNodeId = currentNode.id;

    const nextStep = instructions.steps[step % instructions.steps.length];
    if (nextStep === 'L') currentNode = nodes.get(currentNode.left!.id)!;
    else currentNode = nodes.get(currentNode.right!.id)!;

    debug(`${oldNodeId} => ${currentNode.id}`);

    step++;
  }

  log(step);
};

//start('./files/example.txt');
//start('./files/example2.txt');
start('./files/input.txt');
