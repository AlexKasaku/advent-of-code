import fs from 'fs';
import path from 'path';
import { parseInput, setInitialConjunctionStates } from './utils';

const debugMode = false;
const debug = (...params: any[]) => debugMode && console.log(...params);
const log = (...params: any[]) => console.log(...params);

type Pulse = { value: boolean; from: string; to: string };

const start = async (file: string) => {
  const content = fs.readFileSync(path.join(__dirname, file), 'utf8');

  const modules = parseInput(content);
  setInitialConjunctionStates(modules);

  const totalPresses = 1000;
  let totalLowPulses = 0,
    totalHighPulses = 0;

  for (let presses = 0; presses < totalPresses; presses++) {
    const pulseQueue: Pulse[] = [
      { value: false, from: 'button', to: 'broadcaster' },
    ];

    while (pulseQueue.length > 0) {
      const thisPulse = pulseQueue.shift()!;

      debug(
        `${thisPulse.from} -${thisPulse.value ? 'high' : 'low'}-> ${
          thisPulse.to
        }`,
      );

      if (thisPulse.value) totalHighPulses++;
      else totalLowPulses++;

      const destModule = modules.get(thisPulse.to);

      if (!destModule) {
        // Output module, do nothing.
        continue;
      }

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
          const pulseToOmit = [...destModule.inputStates.values()].every(
            (s) => s,
          )
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
    }
  }

  log(
    `Low: ${totalLowPulses} - High: ${totalHighPulses} - Total: ${
      totalLowPulses * totalHighPulses
    }`,
  );
};

//start('./files/example.txt');
//start('./files/example.2.txt');
start('./files/input.txt'); // rx loops
