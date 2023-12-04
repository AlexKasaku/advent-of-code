/* eslint-disable no-fallthrough */
import toSum from '@utils/toSum';
import fs from 'fs';
import { EOL } from 'os';
import path from 'path';

//const file = './files/example.txt';
const file = './files/input.txt';

type Output =
  | { type: 'dir'; name: string }
  | { type: 'file'; name: string; size: number };

type Execution = {
  command: Command;
  operator?: string;
  output: Output[];
};

type Command = 'ls' | 'cd';

type File = {
  name: string;
  size: number;
};

type Directory = {
  name: string;
  files: File[];
  directories: Directory[];
  parent?: Directory;
  size?: number;
};

const parseCommand = (
  text: string,
): { command: Command; operator?: string } | undefined => {
  switch (text.trim().substring(0, 2)) {
    case 'ls':
      return { command: 'ls' };
    case 'cd':
      return { command: 'cd', operator: text.trim().substring(3) };
  }
  return undefined;
};

const parseOutput = (lines: string[]): Output[] =>
  lines
    .filter((x) => x)
    .map((line) => {
      const parts = line.split(' ');
      if (parts[0] === 'dir') return { type: 'dir', name: parts[1] };
      return { type: 'file', name: parts[1], size: parseInt(parts[0]) };
    });

const parseInput = (content: string) =>
  content
    .split('$')
    .map((p) => p.split(EOL))
    .reduce((execs, group) => {
      const [command, ...output] = group;
      const commandType = parseCommand(command);

      if (commandType) {
        execs.push({ ...commandType, output: parseOutput(output) });
      }
      return execs;
    }, [] as Execution[]);

const createDirectory = (name: string, parent?: Directory): Directory => ({
  name,
  files: [],
  directories: [],
  parent,
});

// Kind of redundant, but handy if we need to change what happens here
const createFile = ({ name, size }: File): File => ({ name, size });

const parseExecutions = (executions: Execution[]): Directory => {
  const root = createDirectory('/');
  let currentDirectory = root;

  for (const { command, operator, output } of executions) {
    switch (command) {
      case 'cd': {
        // Changing directory - assumption is that the command will always work, i.e. won't try to enter a directory
        // that does not exist, or enter it before it has been discovered by 'ls'
        switch (operator) {
          case '/':
            currentDirectory = root;
            break;
          case '..':
            currentDirectory = currentDirectory.parent ?? currentDirectory;
            break;
          default:
            currentDirectory =
              currentDirectory.directories.find((d) => d.name === operator) ??
              currentDirectory;
        }
      }
      case 'ls':
      default: {
        // command is 'ls'
        output.forEach((output) => {
          switch (output.type) {
            case 'dir':
              if (
                !currentDirectory.directories.find(
                  (d) => d.name === output.name,
                )
              )
                currentDirectory.directories.push(
                  createDirectory(output.name, currentDirectory),
                );
              break;
            case 'file':
              // output is file
              if (!currentDirectory.files.find((f) => f.name === output.name))
                currentDirectory.files.push(
                  createFile({ name: output.name, size: output.size }),
                );
          }
        });
      }
    }
  }

  return root;
};

// Walk the tree, depth-first and calculate sizes of directories.
const calculateAllSizes = (directory: Directory): void => {
  directory.directories.forEach((d) => calculateAllSizes(d));
  directory.size = calculateSize(directory);
};

// Walk the tree, depth-first and return any directories that match the predicate.
const deepFindAll = (
  directory: Directory,
  predicate: (d: Directory) => boolean,
): Directory[] => [
  ...directory.directories.flatMap((d) => deepFindAll(d, predicate)),
  ...(predicate(directory) ? [directory] : []),
];

const calculateSize = ({ files, directories }: Directory): number =>
  files.map((f) => f.size).reduce(toSum, 0) +
  directories.map((d) => calculateSize(d)).reduce(toSum, 0);

const start = async () => {
  const content = fs.readFileSync(path.join(__dirname, file), 'utf8');

  const executions = parseInput(content);
  const root = parseExecutions(executions);

  // Update all directories with their sizes
  calculateAllSizes(root);

  const totalSize = 70000000;
  const desiredSize = 30000000;
  const freeSpace = totalSize - (root.size ?? 0);

  // Part 1
  const matchesPart1 = deepFindAll(root, (d) => (d.size ?? 0) <= 100000);
  console.log(matchesPart1.map((d) => d.size ?? 0).reduce(toSum, 0));

  // Part 2
  const matchesPart2 = deepFindAll(
    root,
    (d) => freeSpace + (d.size ?? 0) >= desiredSize,
  );

  console.log(matchesPart2.map((d) => d.size ?? 0).sort((a, b) => a - b)[0]);
};

start();
