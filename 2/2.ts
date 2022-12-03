import fs from 'fs';
import { EOL } from 'os';
import path from 'path';

//const file = '2.example.txt';
const file = '2.input.txt';

// A, X = Rock
// B, Y = Paper
// C, Z = Scissors

// Part 1
// const gameValue = (elf: string, you: string): number => {
//   switch (elf) {
//     case 'A':
//       return you === 'X' ? 3 : you === 'Y' ? 6 : 0;
//     case 'B':
//       return you === 'Y' ? 3 : you === 'Z' ? 6 : 0;
//     case 'C':
//       return you === 'Z' ? 3 : you === 'X' ? 6 : 0;
//   }
//   throw 'Unexpected Input';
// };

// Part 1
// const shapeValue = (you: string): number => {
//     switch (you) {
//       case 'X':
//         return 1;
//       case 'Y':
//         return 2;
//       case 'Z':
//         return 3;
//     }
//     throw 'Unexpected Input';
//   };

// X = Lose
// Y = Draw
// Z = Win

// Part 2
const gameValue = (you: string): number => {
  switch (you) {
    case 'X':
      return 0;
    case 'Y':
      return 3;
    case 'Z':
      return 6;
  }
  throw 'Unexpected Input';
};

const shapeValue = (elf: string, you: string): number => {
  switch (elf) {
    case 'A':
      return you === 'X' ? 3 : you === 'Y' ? 1 : 2;
    case 'B':
      return you === 'X' ? 1 : you === 'Y' ? 2 : 3;
    case 'C':
      return you === 'X' ? 2 : you === 'Y' ? 3 : 1;
  }
  throw 'Unexpected Input';
};

const getScore = (line: string) => {
  const elf = line[0];
  const you = line[2];

  const score = gameValue(you) + shapeValue(elf, you);
  //console.log(score);

  return score;
};

const start = async () => {
  const content = fs.readFileSync(path.join(__dirname, file), 'utf8');

  const total = content
    .split(EOL)
    .map((line) => getScore(line))
    .reduce((x, y) => x + y);

  console.log(total);
};

start();
