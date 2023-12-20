import fs from 'fs';
import path from 'path';
import { parseInput, setInitialConjunctionStates } from './utils';
import lowestCommonMultiple from '@utils/lowestCommonMultiple';
import { Module } from './types';

const debugMode = false;
const debug = (...params: any[]) => debugMode && console.log(...params);
const log = (...params: any[]) => console.log(...params);

type Pulse = { value: boolean; from: string; to: string };

const updateModuleAndOutput = (
  destModule: Module,
  thisPulse: Pulse,
  pulseQueue: Pulse[],
) => {
  switch (destModule.type) {
    case 'broadcast':
      // Repeat pulse to all outputs
      destModule.outputs.forEach((o) =>
        pulseQueue.push({
          value: thisPulse.value,
          from: destModule.id,
          to: o,
        }),
      );
      break;

    case 'flipflop':
      // Only act if pulse is low
      if (!thisPulse.value) {
        destModule.state = !destModule.state;
        destModule.outputs.forEach((o) =>
          pulseQueue.push({
            value: destModule.state,
            from: destModule.id,
            to: o,
          }),
        );
      }
      break;

    case 'conjunction':
      // Update memory
      destModule.inputStates.set(thisPulse.from, thisPulse.value);

      // eslint-disable-next-line no-case-declarations
      const pulseToOmit = [...destModule.inputStates.values()].every((s) => s)
        ? false
        : true;
      destModule.outputs.forEach((o) =>
        pulseQueue.push({
          value: pulseToOmit,
          from: destModule.id,
          to: o,
        }),
      );
      break;
  }
};

const start = async (file: string) => {
  const content = fs.readFileSync(path.join(__dirname, file), 'utf8');

  const modules = parseInput(content);
  setInitialConjunctionStates(modules);

  const totalPresses = 5000;

  // Use a map to track the times where inputs to the ll module
  // are high.
  const loopMap = new Map<string, number>();

  let lowPulses = 0,
    highPulses = 0;

  for (let presses = 0; presses < totalPresses; presses++) {
    const pulseQueue: Pulse[] = [
      { value: false, from: 'button', to: 'broadcaster' },
    ];

    while (pulseQueue.length > 0) {
      const thisPulse = pulseQueue.shift()!;
      if (thisPulse.value) highPulses++;
      else lowPulses++;

      debug(
        `${thisPulse.from} -${thisPulse.value ? 'high' : 'low'}-> ${
          thisPulse.to
        }`,
      );

      const destModule = modules.get(thisPulse.to);

      if (!destModule) {
        // Output module, nothing to do here.
        continue;
      }

      updateModuleAndOutput(destModule, thisPulse, pulseQueue);

      // This solution has been catered to this particular input file, it wouldn't
      // work with another input file!

      // Checking on ll. This will output true to rx when all 4 inputs are high
      // Inputs: kl, vm, kv, vb
      if (
        destModule.id === 'll' &&
        thisPulse.value &&
        !loopMap.has(thisPulse.from)
      ) {
        // This is first time this input is high, record it. Add 1 to presses as we started at 0.
        loopMap.set(thisPulse.from, presses + 1);
        log(`High input from ${thisPulse.from} on ${presses + 1}`);
      }
    }

    // Part 1
    if (presses === 999) {
      log(
        `Low: ${lowPulses} High: ${highPulses} Total Value: ${
          lowPulses * highPulses
        }`,
      );
    }

    // Part 2
    if (loopMap.size === 4) break;
  }
  log(loopMap);

  // The output of ll will be high at the lowest common multiple of when all
  // its inputs are high
  const lcm = lowestCommonMultiple(...loopMap.values());
  log(lcm);
};

//start('./files/example.txt');
//start('./files/example.2.txt');
start('./files/input.txt');
