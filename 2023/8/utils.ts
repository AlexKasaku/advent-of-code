import { EOL } from 'os';
import { Instructions, Node, NodeMap } from './types';

export const parseInput = (input: string): Instructions => {
  const lines = input.split(EOL);

  const steps = lines[0];
  const map = lines.slice(2).map((line) => ({
    id: line.substring(0, 3),
    left: line.substring(7, 10),
    right: line.substring(12, 15),
  }));

  return { steps, map };
};

export const buildNetwork = (nodeMap: NodeMap[]): Map<string, Node> => {
  // Turn written instructions into network of nodes

  // First loop and create empty nodes with no left/right.
  const network = new Map<string, Node>(
    nodeMap.map((n) => [n.id, { id: n.id }]),
  );

  // Now build up left + right
  for (const nodeMapEntry of nodeMap) {
    const node = network.get(nodeMapEntry.id)!;
    node.left = network.get(nodeMapEntry.left)!;
    node.right = network.get(nodeMapEntry.right)!;
  }

  return network;
};
