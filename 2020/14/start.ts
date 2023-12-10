import fs from 'fs';
import path from 'path';
import { parseInput } from './utils';
import { Command } from './types';

const debugMode = false;
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

const part1 = (commands: Command[]) => {
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

  log([...memory.values()].reduce((a, b) => a + b, 0n));
};

const part2 = (commands: Command[]) => {
  // Store memory as a map so we don't need to initialize a gigantic array that is mostly empty
  const memory = new Map<bigint, bigint>();
  let mask = '';

  for (const command of commands) {
    if (command.type === 'mask') {
      mask = command.value;
    } else {
      const binary = [...command.location.toString(2).padStart(36, '0')];
      for (let i = 0; i < binary.length; i++) {
        if (mask[i] !== '0') binary[i] = mask[i];
      }
      const fluctuations = [binary.join('')];
      const addresses = [];

      while (fluctuations.length > 0) {
        const variation = fluctuations.shift()!;
        const firstX = variation.indexOf('X');
        if (firstX === -1) addresses.push(variation);
        else {
          fluctuations.push(
            variation.substring(0, firstX) +
              '0' +
              variation.substring(firstX + 1),
          );
          fluctuations.push(
            variation.substring(0, firstX) +
              '1' +
              variation.substring(firstX + 1),
          );
        }
      }

      debug(addresses);
      for (const address of addresses) {
        const toBigint = binaryToBigInt(address);
        debug(toBigint);
        memory.set(toBigint, BigInt(command.value));
      }
      //break;
    }
  }

  log([...memory.values()].reduce((a, b) => a + b, 0n));
};

const start = async (file: string) => {
  const content = fs.readFileSync(path.join(__dirname, file), 'utf8');

  const commands = parseInput(content);

  part2(commands);
};

//start('./files/example2.txt');
start('./files/input.txt');
