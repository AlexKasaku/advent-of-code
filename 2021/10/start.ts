import { byAscending } from '@utils/sort';
import fs from 'fs';
import { EOL } from 'os';
import path from 'path';

//const file = './files/example.txt';
const file = './files/input.txt';

const matchingBrace = (opening: string, closing: string): boolean => {
  switch (opening) {
    case '(':
      return closing == ')';
    case '[':
      return closing == ']';
    case '{':
      return closing == '}';
    case '<':
      return closing == '>';
  }
  throw 'Invalid opening combination found';
};

const getScore = (char: string, corruption: boolean = true): number => {
  switch (char) {
    case ')':
      return corruption ? 3 : 1;
    case ']':
      return corruption ? 57 : 2;
    case '}':
      return corruption ? 1197 : 3;
    case '>':
      return corruption ? 25137 : 4;
  }
  throw 'Invalid character for checking score';
};

const getAutocompleteScore = (char: string): number => {
  switch (char) {
    case '(':
      return 1;
    case '[':
      return 2;
    case '{':
      return 3;
    case '<':
      return 4;
  }
  throw 'Invalid character for checking score';
};

const start = async () => {
  const content = fs.readFileSync(path.join(__dirname, file), 'utf8');

  let corruptionScore = 0;
  const autocompleteScores: number[] = [];

  content.split(EOL).forEach((line) => {
    const stack = [];
    for (const char of line) {
      if (['(', '[', '{', '<'].includes(char)) {
        stack.push(char);
      } else {
        const opening = stack.pop();

        if (opening == undefined) {
          throw 'Closing before opening';
        } else if (!matchingBrace(opening, char)) {
          corruptionScore += getScore(char, true);
          return;
        }
      }
    }
    if (stack.length) {
      autocompleteScores.push(
        stack
          .reverse()
          .reduce((score, char) => score * 5 + getAutocompleteScore(char), 0),
      );
    }
  });

  console.log('Corruption: ' + corruptionScore);
  console.log(
    'Autocomplete: ' +
      autocompleteScores.sort(byAscending)[
        Math.floor(autocompleteScores.length / 2)
      ],
  );
};

start();
