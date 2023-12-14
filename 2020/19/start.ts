import fs from 'fs';
import path from 'path';
import { parseInput } from './utils';
import toSum from '@utils/toSum';

const debugMode = false;
const debug = (...params: any[]) => debugMode && console.log(...params);
const log = (...params: any[]) => console.log(...params);

const start = async (file: string) => {
  const content = fs.readFileSync(path.join(__dirname, file), 'utf8');

  const config = parseInput(content);

  while (config.rules.size > 3) {
    // Eliminate rule by rule until only one left. We can remove a rule if it
    // doesn't reference any other rules.
    const ruleToRemove = [...config.rules.entries()].find(
      (rule) => !/\d/.test(rule[1]) && rule[0] != 8 && rule[0] != 11,
    )!;

    // Remove the rule
    config.rules.delete(ruleToRemove[0]);

    let wrappedRule =
      ruleToRemove[1].indexOf('|') > -1
        ? `(${ruleToRemove[1]})`
        : ruleToRemove[1];
    wrappedRule = wrappedRule.replaceAll(' ', '');

    // Update every other rule to put the value of this rule into it
    [...config.rules.entries()].forEach((rule) => {
      const regex = `(?<=^|\\D)${ruleToRemove[0]}(?=\\D|$)`;
      const updatedRule = rule[1].replaceAll(
        new RegExp(regex, 'g'),
        wrappedRule,
      );
      config.rules.set(rule[0], updatedRule);
    });
  }

  log(config.rules);

  // const matching = config.tests
  //   .map((t) => (finalRule.test(t) ? 1 : 0))
  //   .reduce(toSum, 0);

  // log(matching);
};

//start('./files/example.part2.changed.txt');
start('./files/input.changed.txt');
