import fs from 'fs';
import path from 'path';
import { parseInput } from './utils';

const file = './files/example.txt';
//const file = './files/input.txt';

const start = async () => {
  const content = fs.readFileSync(path.join(__dirname, file), 'utf8');

  const [template, map] = parseInput(content);

  // Build polymer
  const rounds = 40;
  let polymer = template;
  for (let round = 0; round < rounds; round++) {
    let thisPolymer = polymer[0];
    for (let x = 0; x < polymer.length; x++) {
      const pair = polymer[x] + polymer[x + 1];
      const match = map.get(pair);

      if (match) {
        thisPolymer += match + pair[1];
      }
    }
    polymer = thisPolymer;

    // Now process polymer
    const letterMap = new Map<string, number>();

    for (const letter of polymer)
      letterMap.set(letter, (letterMap.get(letter) || 0) + 1);

    const sortedMap = [...letterMap.entries()].sort((a, b) => b[1] - a[1]);

    console.log(
      `${polymer.length} : ${
        sortedMap[0][1] - sortedMap[sortedMap.length - 1][1]
      }`
    );
  }
};

start();
