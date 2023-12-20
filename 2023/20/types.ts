// export type ButtonModule = {
//   type: 'button';
// };

export type BroadcastModule = {
  type: 'broadcast';
};

export type ConjunctionModule = {
  type: 'conjunction';
  inputStates: Map<string, boolean>;
};

export type FlipFlopModule = {
  type: 'flipflop';
  state: boolean;
};

export type Module = {
  id: string;
  outputs: string[];
} & (ConjunctionModule | FlipFlopModule | BroadcastModule);

export type ModuleCollection = Map<string, Module>;
