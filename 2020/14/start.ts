import fs from 'fs';
import path from 'path';
import { parseInput } from './utils';
import toSum from '@utils/toSum';

const debugMode = true;
const debug = (...params: any[]) => debugMode && console.log(...params);
const log = (...params: any[]) => console.log(...params);

const binaryToBigInt = (number: string): bigint => {
  const one = 1n;
  let integer = 0n;
  for (const c of number) {
    integer <<= 1n;
    if (c == '1') integer |= one;
  }
  return integer;
};

const start = async (file: string) => {
  const content = fs.readFileSync(path.join(__dirname, file), 'utf8');

  const commands = parseInput(content);
  log(commands);

  // Store memory as a map so we don't need to initialize a gigantic array that is mostly empty
  const memory = new Map<bigint, bigint>();
  let mask = '';

  for (const command of commands) {
    log(command);

    let binary = [];
    switch (command.type) {
      case 'mask':
        mask = command.value;
        break;
      default:
      case 'address':
        binary = [...command.value.toString(2).padStart(36, '0')];
        for (let i = 0; i < binary.length; i++) {
          if (mask[i] != 'X') binary[i] = mask[i];
        }
        // eslint-disable-next-line no-case-declarations
        const toBigint = binaryToBigInt(binary.join(''));
        debug(toBigint);

        memory.set(BigInt(command.location), toBigint);
        break;
    }
  }

  log(memory);
  log([...memory.values()].reduce((a, b) => a + b, 0n));
};

//start('./files/example.txt');
start('./files/input.txt');
