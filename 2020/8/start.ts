import fs from 'fs';
import path from 'path';
import { parseInput } from './utils';
import { Operation } from './types';

const debugMode = false;
const debug = (...params: any[]) => debugMode && console.log(...params);
const log = (...params: any[]) => console.log(...params);

const part1 = (operations: Operation[]) => {
  const visitedOperations = new Set<number>();

  let nextOperation = 0;
  let acc = 0;
  let stop = false;

  while (!stop) {
    const operation = operations[nextOperation];

    // Mark this operation as visited
    visitedOperations.add(nextOperation);

    switch (operation.operator) {
      case 'jmp':
        nextOperation = nextOperation + operation.operand;
        break;

      case 'acc':
        acc += operation.operand;
        nextOperation++;
        break;

      case 'nop':
        nextOperation++;
        break;
    }

    // Check if we've visited the next operation, if so stop.
    if (visitedOperations.has(nextOperation)) stop = true;
  }

  log('Acc at time of breaking: ' + acc);
};

const start = async (file: string) => {
  const content = fs.readFileSync(path.join(__dirname, file), 'utf8');

  const operations = parseInput(content);

  debug(operations);

  part1(operations);
};

//start('./files/example.txt');
start('./files/input.txt');
