import fs from 'fs';
import path from 'path';
import { parseInput } from './utils';

//const file = './files/example.txt';
//const file = './files/example.2.txt';
//const file = './files/input.txt';
const file = './files/input.2.txt';

const getReverseOperator = (op: string) => {
  switch (op) {
    case '*':
      return '/';
    case '/':
      return '*';
    case '+':
      return '-';
    case '-':
      return '+';
  }
  return '=';
};

const start = async () => {
  const content = fs.readFileSync(path.join(__dirname, file), 'utf8');

  const monkeys = parseInput(content);

  // Brute force to find the real value
  const traverseStack = [monkeys.get('root')];
  const processStack = [];
  const monkeyValues = new Map<string, number | boolean | string>();

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

  // Not between 0 and 100000

  const solverOperations = [];

  while (processStack.length > 0) {
    const node = processStack.pop()!;

    const leftValue = node.left == 'humn' ? 'x' : monkeyValues.get(node.left!);

    if (leftValue === undefined) throw 'Could not get left value!';
    const rightValue =
      node.right == 'humn' ? 'x' : monkeyValues.get(node.right!);

    if (rightValue === undefined) throw 'Could not get right value!';

    // Calculate
    const toEval = `${leftValue} ${node.operation} ${rightValue}`.replace(
      '=',
      '=='
    );

    if (toEval.indexOf('x') > -1) {
      // Contains unknown value, push as string
      monkeyValues.set(node.name, `(${toEval})`);

      // Push the other operand to the solvers
      if (typeof leftValue === 'string') {
        // Left contains x
        solverOperations.push(
          `x ${getReverseOperator(node.operation!)} ${rightValue}`
        );
      } else {
        // Right contains x - requires more finesse
        switch (node.operation!) {
          case '*':
            solverOperations.push(`x / ${leftValue}`);
            break;
          case '/':
            solverOperations.push(`${leftValue} / x `);
            break;
          case '+':
            solverOperations.push(`x - ${leftValue}`);
            break;
          case '-':
            solverOperations.push(`${leftValue} - x`);
            break;
        }
      }
    } else {
      // We can work this out now, add the value
      const value = eval(toEval);

      monkeyValues.set(node.name, value);
    }
  }

  // Write out what is at root
  const equation = monkeyValues.get('root') as string;
  console.log(equation);

  // Walk backwards through equation
  let finalValue = solverOperations.pop()?.split(' = ')[1];

  while (solverOperations.length > 0) {
    finalValue = eval(
      solverOperations.pop()!.replace('x', finalValue!.toString())
    );
  }

  console.log(`x = ${finalValue}`);
};

start();
