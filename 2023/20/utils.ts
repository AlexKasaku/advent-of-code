import { EOL } from 'os';
import { Module, ModuleCollection } from './types';

export const parseInput = (input: string): ModuleCollection => {
  return new Map<string, Module>(
    input.split(EOL).map((line) => {
      const regex = /^(.+) -> (.+)$/;
      const match = line.match(regex);
      if (!match) throw `Could not parse line: ${line}`;

      const id = match[1] === 'broadcaster' ? match[1] : match[1].substring(1);
      const outputs = match[2].split(',').map((o) => o.trim());

      let module: Module;

      if (id === 'broadcaster') {
        module = { type: 'broadcast', id, outputs };
      } else {
        if (match[1][0] === '%') {
          module = { type: 'flipflop', id, outputs, state: false };
        } else {
          module = {
            type: 'conjunction',
            id,
            outputs,
            inputStates: new Map<string, boolean>(),
          };
        }
      }

      return [id, module];
    }),
  );
};

export const setInitialConjunctionStates = (
  modules: ModuleCollection,
): void => {
  for (const module of modules.values()) {
    if (module.type === 'conjunction') {
      // Find all inputs to this module
      const inputs = [...modules.values()]
        .filter((m) => m.outputs.some((o) => o === module.id))
        .map((m) => m.id);

      inputs.forEach((i) => module.inputStates.set(i, false));
    }
  }
};
