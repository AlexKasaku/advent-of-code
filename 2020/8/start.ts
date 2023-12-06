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

const part2 = (operations: Operation[]) => {
  const operationsToTweak = operations.filter((o) => o.operator != 'acc');

  log(operationsToTweak);

  for (const operationToTweak of operationsToTweak) {
    // Change the operator
    operations[operationToTweak.id].operator =
      operationToTweak.operator == 'jmp' ? 'nop' : 'jmp';

    // Now run just like part 1, but see if we loop or terminate properly.
    const visitedOperations = new Set<number>();

    let nextOperation = 0;
    let acc = 0;
    let looped = false;
    let stopped = false;

    while (!looped && !stopped) {
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
      if (visitedOperations.has(nextOperation)) looped = true;

      // Or check if we've run off the end of the program
      if (nextOperation == operations.length) {
        log('Program is terminating!');
        stopped = true;
      }
    }

    // Change the operator back
    operations[operationToTweak.id].operator =
      operationToTweak.operator == 'jmp' ? 'nop' : 'jmp';

    if (stopped) log('Acc at time of breaking: ' + acc);
  }
};

const start = async (file: string) => {
  const content = fs.readFileSync(path.join(__dirname, file), 'utf8');

  const operations = parseInput(content);

  part2(operations);
};

//start('./files/example.txt');
start('./files/input.txt');
