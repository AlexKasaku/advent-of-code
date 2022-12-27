import fs from 'fs';
import path from 'path';
import { parseInput } from './utils';

//const file = './files/example.txt';
const file = './files/input.txt';

const start = async () => {
  const content = fs.readFileSync(path.join(__dirname, file), 'utf8');

  const [template, map] = parseInput(content);

  // Set initial pair counts from template
  const pairCount = new Map<string, number>();
  for (let x = 0; x < template.length - 1; x++) {
    const pair = template[x] + template[x + 1];
    pairCount.set(pair, (pairCount.get(pair) || 0) + 1);
  }

  const letterMap = new Map<string, number>();

  const rounds = 40;
  for (let round = 0; round < rounds; round++) {
    const mapSnapshot = new Map<string, number>([...pairCount]);

    for (const [pair, count] of mapSnapshot) {
      const mapsTo = map.get(pair)!;

      pairCount.set(pair, (pairCount.get(pair) || 0) - count);
      pairCount.set(mapsTo[0], (pairCount.get(mapsTo[0]) || 0) + count);
      pairCount.set(mapsTo[1], (pairCount.get(mapsTo[1]) || 0) + count);

      letterMap.set(mapsTo[0][1], (letterMap.get(mapsTo[0][1]) || 0) + count);
    }
  }

  // Finally add first letters
  for (const letter of template)
    letterMap.set(letter, (letterMap.get(letter) || 0) + 1);

  const sortedMap = [...letterMap.entries()].sort((a, b) => b[1] - a[1]);

  console.log(sortedMap);
  console.log(sortedMap[0][1] - sortedMap[sortedMap.length - 1][1]);
};

start();
