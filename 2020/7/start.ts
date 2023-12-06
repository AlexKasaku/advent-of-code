import fs from 'fs';
import path from 'path';
import { parseInput } from './utils';
import difference from '@utils/difference';

const debugMode = true;
const debug = (...params: any[]) => debugMode && console.log(...params);
const log = (...params: any[]) => console.log(...params);

const start = async (file: string) => {
  const content = fs.readFileSync(path.join(__dirname, file), 'utf8');

  const config = parseInput(content);

  // Part 1

  // Stack of types remaining to check.
  const typesThatCanHoldGoldBag = new Set<string>();

  // Get initial bag types that can hold gold bag
  const shinyGoldBagType = 'shiny gold';

  let checkStack = new Set<string>([shinyGoldBagType]);

  while (checkStack.size > 0) {
    const [bagToFind, ...remainingBags] = [...checkStack];

    debug();
    debug(`Finding bags that can hold a: ${bagToFind}`);

    const outerBagTypes = [
      ...[...config.entries()]
        .filter((c) => c[1].some((t) => t.type === bagToFind))
        .map((c) => c[0]),
    ];

    if (outerBagTypes.length > 0) debug(`Found these bags: ${outerBagTypes}`);
    else debug(`Found no bags`);

    const bagsFoundNotYetChecked = difference(outerBagTypes, [
      ...typesThatCanHoldGoldBag,
    ]);

    if (bagsFoundNotYetChecked.length > 0) {
      debug(`These haven't been checked yet: ${bagsFoundNotYetChecked}`);

      bagsFoundNotYetChecked.forEach((type) =>
        typesThatCanHoldGoldBag.add(type),
      );
    }

    checkStack = new Set<string>([...bagsFoundNotYetChecked, ...remainingBags]);
  }

  log(typesThatCanHoldGoldBag);
};

//start('./files/example.txt');
start('./files/input.txt');
