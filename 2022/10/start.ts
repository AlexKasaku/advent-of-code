import fs from 'fs';
import { EOL } from 'os';
import path from 'path';

//const file = './files/example.txt';
const file = './files/input.txt';

type Operation = NoopOperation | AddOperation;
type NoopOperation = {
  operator: 'noop';
};
type AddOperation = {
  operator: 'addx';
  operand: number;
};
const parseOperation = (line: string): Operation => {
  const [operator, operand] = line.split(' ');

  switch (operator) {
    case 'noop':
      return { operator };
    case 'addx':
      return { operator, operand: parseInt(operand) };
  }
  throw 'Unsupported operator: ' + line;
};

const start = async () => {
  const content = fs.readFileSync(path.join(__dirname, file), 'utf8');

  let cycle = 1;
  let x = 1;
  let total = 0;

  const operations = content.split(EOL).map((x) => parseOperation(x));

  let delayedOp: Operation | undefined = undefined;
  let delayedTimer = 0;

  while (true) {
    // // Now output x as value of *this* cycle
    if ((cycle - 20) % 40 === 0) {
      total += cycle * x;
      console.log(`[${cycle}] x = ${x}, total = ${total}`);
    }
    //console.log(`[${cycle}] x = ${x}`);

    if (delayedOp) {
      delayedTimer--;
      if (delayedTimer === 0) {
        switch (delayedOp.operator) {
          case 'addx':
            x += delayedOp.operand;
        }
        delayedOp = undefined;
      }
    } else {
      const nextOp = operations.shift();
      if (!nextOp) break;

      switch (nextOp.operator) {
        case 'addx':
          delayedOp = nextOp;
          delayedTimer = 1;
      }
    }

    cycle++;
  }
  console.log(total);
};

start();
