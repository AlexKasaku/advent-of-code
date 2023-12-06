import fs from 'fs';
import path from 'path';
import { parseInput } from './utils';
import difference from '@utils/difference';
import { BagConfiguration } from './types';
import toSum from '@utils/toSum';

const debugMode = true;
const debug = (...params: any[]) => debugMode && console.log(...params);
const log = (...params: any[]) => console.log(...params);

const shinyGoldBagType = 'shiny gold';

const part1 = (config: BagConfiguration) => {
  const typesThatCanHoldGoldBag = new Set<string>();

  // Get initial bag types that can hold gold bag
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

const part2 = (config: BagConfiguration) => {
  // Need to find the total number of bags that a shiny gold bag will contain. This shouldn't
  // loop otherwise we'd get infinite bags.

  // However we may find bags that contain other bags we've already checked.
  const bagCountsWithinBag = new Map<string, number>();

  const checkStack = [shinyGoldBagType];

  // Traverse the bag tree until we find leaf nodes and then start working back up from there.
  while (checkStack.length > 0) {
    const bagToCheck = checkStack.pop()!;
    const bagConfig = config.get(bagToCheck)!;

    // if (bagConfig.length > 0) {
    //   // This bag has at least some other bags in it
    // }

    // Check if we have all the measurements we need to complete this bag.
    const innerBagsNotYetChecked = [];
    for (const innerBag of bagConfig) {
      if (!bagCountsWithinBag.has(innerBag.type))
        innerBagsNotYetChecked.push(innerBag.type);
    }

    if (innerBagsNotYetChecked.length > 0) {
      // We don't have the details to complete this bag, so add this bag back to stack along with the other bags it needs.
      checkStack.push(bagToCheck, ...innerBagsNotYetChecked);
    } else {
      // We can add a count for this bag!
      const innerBagCounts = bagConfig
        .map((b) => b.count + bagCountsWithinBag.get(b.type)! * b.count)
        .reduce(toSum, 0);

      bagCountsWithinBag.set(bagToCheck, innerBagCounts);
    }
  }

  log(bagCountsWithinBag);
};

const start = async (file: string) => {
  const content = fs.readFileSync(path.join(__dirname, file), 'utf8');

  const config = parseInput(content);

  //part1(config);
  part2(config);
};

//start('./files/example.txt');
start('./files/input.txt');
