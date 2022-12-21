import fs from 'fs';
import path from 'path';
import { parseInput } from './utils';

//const file = './files/example.txt';
const file = './files/input.txt';

const start = async () => {
  const content = fs.readFileSync(path.join(__dirname, file), 'utf8');

  const monkeys = parseInput(content);

  const traverseStack = [monkeys.get('root')];
  const processStack = [];
  const monkeyValues = new Map<string, number>();

  while (traverseStack.length > 0) {
    const node = traverseStack.pop()!;

    if (node.operation) {
      processStack.push(node);

      traverseStack.push(monkeys.get(node.left!));
      traverseStack.push(monkeys.get(node.right!));
    } else {
      monkeyValues.set(node.name, node.value!);
    }
  }

  // Now process the monkeys
  let total = 0;
  while (processStack.length > 0) {
    const node = processStack.pop()!;

    const leftValue = monkeyValues.get(node.left!);

    if (leftValue === undefined) throw 'Could not get left value!';
    const rightValue = monkeyValues.get(node.right!);

    if (rightValue === undefined) throw 'Could not get right value!';

    // Calculate
    const toEval = `${leftValue} ${node.operation} ${rightValue}`;

    const value = eval(toEval);

    monkeyValues.set(node.name, value);
  }

  console.log(monkeyValues);
  console.log(monkeyValues.get('root'));
};

start();
