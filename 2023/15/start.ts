import fs from 'fs';
import path from 'path';
import { parseInput } from './utils';
import findAndRemove from '@utils/findAndRemove';

const debugMode = false;
const debug = (...params: any[]) => debugMode && console.log(...params);
const log = (...params: any[]) => console.log(...params);

const part1 = (steps: string[]): void => {
  let total = 0;
  for (const step of steps) {
    let currentValue = 0;

    step.split('').forEach((c) => {
      const ascii = c.charCodeAt(0);
      currentValue += ascii;
      currentValue *= 17;
      currentValue %= 256;
    });

    debug(`${step} -> ${currentValue}`);
    total += currentValue;
  }

  log(total);
};

const part2 = (steps: string[]): void => {
  const boxes = new Map<number, Lens[]>(
    [...new Array(256)].fill(0).map((x, i) => [i, []]),
  );

  type Lens = { label: string; focalPoint: number };

  for (const step of steps) {
    const label = step.match(/[a-z]+/)?.[0];

    if (!label) throw 'No label found';

    const boxIndex = label.split('').reduce((value, c) => {
      const ascii = c.charCodeAt(0);
      value += ascii;
      value *= 17;
      value %= 256;
      return value;
    }, 0);

    debug(`${label} -> ${boxIndex}`);

    const boxArray = boxes.get(boxIndex)!;

    if (step.endsWith('-')) {
      // Removal step
      findAndRemove(boxArray, (b) => b.label === label);
    } else {
      // Set step
      const focalPoint = parseInt(step[step.length - 1]);
      const existingLensIndex = boxArray.findIndex((l) => l.label === label);

      if (existingLensIndex > -1) {
        // Update
        boxArray[existingLensIndex].focalPoint = focalPoint;
      } else {
        // Push in
        boxArray.push({ label, focalPoint });
      }
    }
  }

  // Find total
  let focusingPower = 0;

  boxes.forEach((boxArray, boxIndex) => {
    boxArray.forEach((lens, lensIndex) => {
      focusingPower += (boxIndex + 1) * (lensIndex + 1) * lens.focalPoint;
    });
  });

  log(focusingPower);
};

const start = async (file: string) => {
  const content = fs.readFileSync(path.join(__dirname, file), 'utf8');

  const steps = parseInput(content);

  part1(steps);
  part2(steps);
};

//start('./files/example.txt');
start('./files/input.txt');
