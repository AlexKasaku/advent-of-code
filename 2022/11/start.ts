import { byDescending } from '@utils/sort';
import fs from 'fs';
import path from 'path';

//const file = './files/example.txt';
const file = './files/input.txt';

const debugExpressions = false;

type Monkey = {
  items: number[];
  operation: (val: number) => number;
  divisor: number;
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
  return (val: number): number => {
    let expression = operation.replaceAll('old', val.toString());

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
      items: items.split(', ').map((x) => parseInt(x)),
      operation: createOperation(operation),
      divisor: parseInt(divisor),
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
  const rounds = 10000;
  const lowestCommonMultiple = monkeys
    .map((x) => x.divisor)
    .reduce((a, b) => a * b);

  for (let r = 0; r < rounds; r++) {
    for (const monkey of monkeys) {
      while (monkey.items.length) {
        let item = monkey.items.shift()!;

        item = monkey.operation(item);

        // Reduce the item value down in a way that won't affect any
        // further calculations by taking the remainder from dividing by
        // the lowest common multiple
        if (item > lowestCommonMultiple) {
          item = item % lowestCommonMultiple;
        }

        const newIndex =
          item % monkey.divisor === 0
            ? monkey.trueMonkeyIndex
            : monkey.falseMonkeyIndex;

        monkeys[newIndex].items.push(item);

        monkey.inspections += 1;
      }
    }
    //if (r % 250 === 0) console.log('Completed round ' + r);
  }

  //console.dir(monkeys[0].items[0].indexChain, { depth: null });

  const topActive = monkeys.map((x) => x.inspections).sort(byDescending);

  console.log(topActive[0]);
  console.log(topActive[1]);
  console.log(topActive[0] * topActive[1]);
};

start();
