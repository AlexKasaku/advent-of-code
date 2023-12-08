export type NodeMap = {
  id: string;
  left: string;
  right: string;
};

export type Instructions = {
  steps: string;
  map: NodeMap[];
};

export type Node = {
  id: string;
  left?: Node;
  right?: Node;
};
