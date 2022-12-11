import { byDescending } from '@utils/sort';
import fs from 'fs';
import { EOL } from 'os';
import path from 'path';

const file = './files/example.txt';
//const file = './files/input.txt';

const debugExpressions = false;

type Item = {
  value: bigint;
  indexChain: number[];
};

type Monkey = {
  items: Item[];
  operation: (val: bigint) => bigint;
  divisor: bigint;
  trueMonkeyIndex: number;
  falseMonkeyIndex: number;
  inspections: number;
};

// Monkey 0:
//   Starting items: 79, 98
//   Operation: new = old * 19
//   Test: divisible by 23
//     If true: throw to monkey 2
//     If false: throw to monkey 3
const monkeyInputRegex =
  /Monkey[\s\S]+?items: (?<items>[\d ,]+)[\s\S]+?= (?<operation>.*)[\s\S]+?by (?<divisor>\d+)[\s\S]+?monkey (?<trueMonkey>\d+)[\s\S]+?monkey (?<falseMonkey>\d+)/gm;

const createOperation = (operation: string) => {
  // Uses eval, only to be used when we're sure of the input!
  return (val: bigint): bigint => {
    let expression = operation.replaceAll('old', val.toString() + 'n');

    if (!expression.endsWith('n')) expression += 'n';

    // Let's be safe, only allow digits, spaces, + and * through
    if (!operation.match(/[/d +*]+/))
      throw 'Suspicious input when creating operation: ' + operation;

    if (debugExpressions) console.log(`Creating expression: ${expression}`);

    return eval(expression);
  };
};

const parseInput = (content: string): Monkey[] => {
  const monkeys = [];
  let match;
  while ((match = monkeyInputRegex.exec(content)) !== null) {
    if (!match.groups) throw 'Could not parse monkey input!';

    const { items, operation, divisor, trueMonkey, falseMonkey } = match.groups;
    monkeys.push({
      items: items
        .split(', ')
        .map((x) => ({ value: BigInt(x), indexChain: [] })),
      operation: createOperation(operation),
      divisor: BigInt(divisor),
      trueMonkeyIndex: parseInt(trueMonkey),
      falseMonkeyIndex: parseInt(falseMonkey),
      inspections: 0,
    });
  }
  return monkeys;
};

const start = async () => {
  const content = fs.readFileSync(path.join(__dirname, file), 'utf8');

  const monkeys: Monkey[] = parseInput(content);
  const rounds = 500;

  for (let r = 0; r < rounds; r++) {
    for (const monkey of monkeys) {
      while (monkey.items.length) {
        const item = monkey.items.shift()!;

        //const newValue = Math.floor(monkey.operation(item) / 3);
        item.value = monkey.operation(item.value);

        // if (newValue % 96577n == 0n) {
        //   console.log(`Rounded ${newValue}`);
        //   newValue /= 96577n;
        // }

        // if (newValue % monkey.divisor === 0n) {
        //   newValue = newValue / monkey.divisor;
        // }

        const newIndex =
          item.value % monkey.divisor === 0n
            ? monkey.trueMonkeyIndex
            : monkey.falseMonkeyIndex;

        item.indexChain.push(newIndex);
        monkeys[newIndex].items.push(item);

        monkey.inspections += 1;
      }
    }
    if (r % 100 === 0) console.log('Completed round ' + r);
  }

  console.dir(monkeys[0].items[0].indexChain, {
    maxArrayLength: null,
    depth: null,
  });

  const topActive = monkeys.map((x) => x.inspections).sort(byDescending);

  console.log(topActive[0]);
  console.log(topActive[1]);
  console.log(topActive[0] * topActive[1]);
};

start();
