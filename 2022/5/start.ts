import fs from 'fs';
import { reverse } from 'lodash';
import { EOL } from 'os';
import path from 'path';

//const file = './files/example.txt';
const file = './files/input.txt';

type Stack = string[];
type Move = { value: number; from: number; to: number };

const parseState = (lines: string[]) => {
  const stackCount = (lines[0].length + 1) / 4;
  const stacks: Stack[] = Array(stackCount)
    .fill(0)
    .map((_) => []);

  for (const line of lines.reverse()) {
    for (let col = 0; col < stackCount; col++) {
      const value = line[col * 4 + 1];
      if (value != ' ') stacks[col].push(value);
    }
  }

  return stacks;
};

const parseMoves = (lines: string[]): Move[] => {
  const moves: Move[] = [];
  for (const line of lines) {
    const match = /?<value>\d+) from (?<from>\d+) to (?<to>\d+)/g.exec(line);
    if (match?.groups) {
      const { value, from, to } = match.groups;
      moves.push({
        value: parseInt(value),
        from: parseInt(from),
        to: parseInt(to),
      });
    }
  }
  return moves;
};

const parseContent = (lines: string[]) => {
  const stateLines: string[] = [];
  const moveLines: string[] = [];
  let parsingState = true;
  for (const line of lines) {
    if (parsingState) {
      if (/^(\d|\s)+$/g.test(line)) {
        parsingState = false;
        continue;
      }
      stateLines.push(line);
    } else {
      moveLines.push(line);
    }
  }

  return {
    state: parseState(stateLines),
    moves: parseMoves(moveLines.slice(1)),
  };
};

const updateState = (
  state: Stack[],
  { value, from, to }: Move,
  moveAsGroup: boolean = true
) => {
  let toAdd: string[] = [];
  Array(value)
    .fill(0)
    .forEach((_) => {
      const popped = state[from - 1].pop();
      if (!popped) throw 'Nothing to pull from the stack!';
      toAdd.push(popped);
    });

  if (moveAsGroup) toAdd = reverse(toAdd);

  state[to - 1].push(...toAdd);

  return state;
};

const getTopBoxState = (state: Stack[]) =>
  state.map((stack) => stack[stack.length - 1]).join('');
const start = async () => {
  const content = fs.readFileSync(path.join(__dirname, file), 'utf8');

  let { state, moves } = parseContent(content.split(EOL));

  // False for Part 1, True for Part 2
  const moveAsGroup = false;

  moves.forEach((move) => (state = updateState(state, move, moveAsGroup)));

  console.log(getTopBoxState(state));
};

start();
