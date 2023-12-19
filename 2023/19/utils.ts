import { EOL } from 'os';
import { Configuration, Part, Rule, Transfer, Workflow } from './types';

export const parseInput = (input: string): Configuration => {
  const sections = input.split(EOL + EOL);

  return {
    workflows: parseWorkflows(sections[0]),
    parts: parseParts(sections[1]),
  };
};

const parseWorkflows = (lines: string): Map<string, Workflow> => {
  const map = new Map<string, Workflow>();

  lines.split(EOL).forEach((line) => {
    /* Examples:
    fqj{x<3467:R,A}
    rfs{m>214:tbh,A}
    bzp{x<3394:A,a>3167:R,a<2804:R,A}
    */
    const regex = /([a-z]+){(.+)}/;
    const match = line.match(regex);
    if (!match) throw 'Invalid line found';

    const id = match[1];
    const rule = buildRule(match[2]);

    map.set(id, { id, rule });
  });

  return map;
};

// Recursive function to build up a rule set
const buildRule = (rule: string): Rule => {
  /* Examples:
    x<3467:R,A
    m>214:tbh,A
    x<3394:A,a>3167:R,a<2804:R,A
    */
  const regex = /^(.+?):(.+?),(.+)$/;
  const match = rule.match(regex);
  if (!match) throw 'Invalid rule found';

  return {
    condition: match[1],
    pass: buildRuleOrTransfer(match[2]),
    fail: buildRuleOrTransfer(match[3]),
  };
};

const buildRuleOrTransfer = (value: string): Rule | Transfer => {
  if (value == 'A') return { toAccept: true };
  if (value == 'R') return { toReject: true };
  if (/^[a-z]+$/.test(value)) return { toWorkflow: value };

  return buildRule(value);
};

const parseParts = (lines: string): Part[] => {
  return lines.split(EOL).map((line) => {
    // Example:
    // {x=783,m=472,a=1211,s=3139}

    const regex = /{x=(\d+),m=(\d+),a=(\d+),s=(\d+)}/;
    const match = line.match(regex);
    if (!match) throw 'Invalid part found';

    return {
      x: parseInt(match[1]),
      m: parseInt(match[2]),
      a: parseInt(match[3]),
      s: parseInt(match[4]),
    };
  });
};
