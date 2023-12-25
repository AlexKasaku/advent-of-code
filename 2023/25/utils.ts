import { EOL } from 'os';
import { EdgeConfiguration } from './types';
import { notDeepStrictEqual } from 'assert';
import findAndRemove from '@utils/findAndRemove';

export const parseInput = (input: string): EdgeConfiguration[] => {
  return input.split(EOL).map((line) => {
    // xld: rvf jlg spv qfb drd
    const parts = line.split(':');

    return {
      source: parts[0],
      dest: parts[1]
        .trim()
        .split(' ')
        .map((p) => p.trim()),
    };
  });
};

type Edge = { source: string; dest: string };
type Graph = { edges: Edge[]; nodes: Set<string> };

export const buildGraph = (edgeInput: EdgeConfiguration[]): Graph => {
  const edges = [];
  const nodes = new Set<string>();

  for (const edge of edgeInput) {
    nodes.add(edge.source);
    for (const dest of edge.dest) {
      nodes.add(dest);
      edges.push({ source: edge.source, dest });
    }
  }

  return { edges, nodes };
};

type CutResult = {
  edgesLeft: number;
  group1: string[];
  group2: string[];
};

// Implementation of Karger's algorithm to randomly try and find the minimum cut:
// https://en.wikipedia.org/wiki/Karger%27s_algorithm
export const kargerMinimumCut = ({
  nodes,
  edges: graphEdges,
}: Graph): CutResult => {
  let vertices = nodes.size;
  // Copy edge array + objects so we can edit without affecting source.
  const edges = graphEdges.map((e) => ({ source: e.source, dest: e.dest }));

  while (vertices > 2) {
    // Choose a random edge
    const index = Math.floor(Math.random() * edges.length);
    const randomEdge = edges[index];

    // Remove edge from the array
    edges.splice(index, 1);

    const newNode = `${randomEdge.source},${randomEdge.dest}`;

    // Update all existing edges to point to this
    for (const edge of edges) {
      if (edge.dest == randomEdge.source) edge.dest = newNode;
      if (edge.source == randomEdge.source) edge.source = newNode;
      if (edge.dest == randomEdge.dest) edge.dest = newNode;
      if (edge.source == randomEdge.dest) edge.source = newNode;
    }

    // Remove self-loops
    let found: Edge[];
    do {
      found = findAndRemove(edges, (e) => e.source === e.dest);
    } while (found.length > 0);

    vertices--;
  }

  return {
    edgesLeft: edges.length,
    group1: edges[0].source.split(','),
    group2: edges[0].dest.split(','),
  };
};
