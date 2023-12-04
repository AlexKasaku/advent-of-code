import intersect from '@utils/intersect';
import toSum from '@utils/toSum';
import fs from 'fs';
import path from 'path';
import { Round } from './types';
import { parseInput } from './utils';

const debugMode = true;
const debug = (...params: any[]) => debugMode && console.log(...params);
const log = (...params: any[]) => console.log(...params);

const part1 = (rounds: Round[]) => {
  let total = 0;
  for (const round of rounds) {
    const matches = intersect(round.winningNumbers, round.numbers).length;
    const value = matches > 0 ? Math.pow(2, matches - 1) : 0;

    debug(`Card ${round.id} value: ${value}`);

    total += value;
  }
  log(`Part 1 Total: ${total}`);
};

type CardCopies = Map<number, number>;

const part2 = (rounds: Round[]) => {
  // Initialize copy map with entry of 1 for every card
  const cardCopies: CardCopies = new Map<number, number>(
    [...new Array(rounds.length)].map((x, i) => [i + 1, 1]),
  );

  console.dir(cardCopies, { depth: null });

  for (const round of rounds) {
    const copiesOfThisCard = cardCopies.get(round.id)!;

    const matches = intersect(round.winningNumbers, round.numbers).length;

    debug(`${copiesOfThisCard} copies of ${round.id}`);

    for (let index = 1; index <= matches; index++) {
      const copyId = round.id + index;
      cardCopies.set(copyId, (cardCopies.get(copyId) ?? 1) + copiesOfThisCard);
    }
  }

  // Add up copies
  const cardCopiesTotal = [...cardCopies.values()].reduce(toSum);

  log(`Part 2 Total: ${cardCopiesTotal}`);
};

const start = async (file: string) => {
  const content = fs.readFileSync(path.join(__dirname, file), 'utf8');

  const rounds = parseInput(content);

  //part1(rounds);
  part2(rounds);
};

//start('./files/example.txt');
start('./files/input.txt');
