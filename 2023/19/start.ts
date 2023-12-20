import fs from 'fs';
import path from 'path';
import { parseInput } from './utils';
import { Configuration, Part, Rule, Transfer, Workflow } from './types';
import range from '@utils/range';
import intersect from '@utils/intersect';

const debugMode = false;
const debug = (...params: any[]) => debugMode && console.log(...params);
const log = (...params: any[]) => console.log(...params);

const start = async (file: string) => {
  const content = fs.readFileSync(path.join(__dirname, file), 'utf8');

  const config = parseInput(content);

  //part1(config);
  part2(config);
};

type Range = number[];
type PartRanges = { x: Range; m: Range; a: Range; s: Range };

const part2 = ({ workflows }: Configuration): void => {
  // Work down through workflows, maintaining at each point the range of values that is valid.
  // When we reach an endpoint, add the combinations.
  // May need to account for crossover, so just maintain a list and go from there.

  const startingRange: PartRanges = {
    x: range(1, 4000),
    m: range(1, 4000),
    a: range(1, 4000),
    s: range(1, 4000),
  };

  const acceptableRanges = findAcceptableRangesInRule(
    startingRange,
    workflows.get('in')!.rule,
    workflows,
  );

  let totalCombos = 0;
  for (const acceptableRange of acceptableRanges) {
    //log(acceptableRange);
    const combos =
      acceptableRange.x.length *
      acceptableRange.m.length *
      acceptableRange.a.length *
      acceptableRange.s.length;
    log(combos);
    totalCombos += combos;
  }
  log(totalCombos);
};

const findAcceptableRangesInRule = (
  range: PartRanges,
  rule: Rule,
  workflows: Map<string, Workflow>,
): PartRanges[] => {
  const [rangeForPass, rangeForFail] = reducePartRanges(
    { ...range },
    rule.condition,
  );

  let rangesForPassing: PartRanges[] = [];
  if ('condition' in rule.pass) {
    rangesForPassing = findAcceptableRangesInRule(
      rangeForPass,
      rule.pass,
      workflows,
    );
  } else if (rule.pass.toWorkflow) {
    rangesForPassing = findAcceptableRangesInRule(
      rangeForPass,
      workflows.get(rule.pass.toWorkflow)!.rule,
      workflows,
    );
  } else if (rule.pass.toAccept) {
    rangesForPassing = [rangeForPass];
  }

  let rangesForFailing: PartRanges[] = [];
  if ('condition' in rule.fail) {
    rangesForFailing = findAcceptableRangesInRule(
      rangeForFail,
      rule.fail,
      workflows,
    );
  } else if (rule.fail.toWorkflow) {
    rangesForFailing = findAcceptableRangesInRule(
      rangeForFail,
      workflows.get(rule.fail.toWorkflow)!.rule,
      workflows,
    );
  } else if (rule.fail.toAccept) {
    rangesForFailing = [rangeForFail];
  }

  return [...rangesForPassing, ...rangesForFailing];
};

const reducePartRanges = (
  partRanges: PartRanges,
  condition: string,
): [PartRanges, PartRanges] => {
  const partId = condition[0] as 'x' | 'm' | 'a' | 's';
  const isLessThan = condition[1] === '<';
  const value = parseInt(condition.substring(2));

  const validRange = isLessThan ? range(1, value - 1) : range(value + 1, 4000);
  const invalidRange = isLessThan ? range(value, 4000) : range(1, value);

  const passConditionPartRange = { ...partRanges };
  passConditionPartRange[partId] = intersect(
    passConditionPartRange[partId],
    validRange,
  );

  const failConditionPartRange = { ...partRanges };
  failConditionPartRange[partId] = intersect(
    failConditionPartRange[partId],
    invalidRange,
  );

  return [passConditionPartRange, failConditionPartRange];
};

const part1 = ({ parts, workflows }: Configuration): void => {
  let acceptedPartsTotal = 0;

  for (const part of parts) {
    let workflowId = 'in';

    // eslint-disable-next-line no-constant-condition
    while (true) {
      const workflow = workflows.get(workflowId)!;
      const transfer: Transfer = applyRule(part, workflow.rule) as Transfer;

      if (transfer.toWorkflow) {
        // Transfer to workflow
        workflowId = transfer.toWorkflow;
      } else if (transfer.toAccept) {
        // Accepted
        const partValue = part.x + part.m + part.a + part.s;
        acceptedPartsTotal += partValue;
        break;
      } else {
        // Rejected;
        break;
      }
    }
  }

  log(acceptedPartsTotal);
};

const applyRule = (
  part: Part,
  ruleOrTransfer: Rule | Transfer,
): Rule | Transfer => {
  if ('condition' in ruleOrTransfer) {
    if (applyCondition(part, ruleOrTransfer.condition))
      return applyRule(part, ruleOrTransfer.pass);
    else return applyRule(part, ruleOrTransfer.fail);
  } else return ruleOrTransfer;
};

const applyCondition = (part: Part, condition: string): boolean => {
  // Just using eval for now
  const conditionToEval = condition
    .replace('x', part.x.toString())
    .replace('m', part.m.toString())
    .replace('a', part.a.toString())
    .replace('s', part.s.toString());

  // Should always be safe ;)
  if (/[^\d<>]/.test(conditionToEval))
    throw 'Can not evaluate condition as contains more than numbers or comparers';

  return eval(conditionToEval) as boolean;
};

//start('./files/example.txt');
start('./files/input.txt');
//start('./files/test.1.txt');
