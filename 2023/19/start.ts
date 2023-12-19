import fs from 'fs';
import path from 'path';
import { parseInput } from './utils';
import { Part, Rule, Transfer } from './types';

const debugMode = false;
const debug = (...params: any[]) => debugMode && console.log(...params);
const log = (...params: any[]) => console.log(...params);

const start = async (file: string) => {
  const content = fs.readFileSync(path.join(__dirname, file), 'utf8');

  const { parts, workflows } = parseInput(content);

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
