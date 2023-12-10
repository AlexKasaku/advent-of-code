import fs from 'fs';
import path from 'path';
import { parseInput } from './utils';
import { TicketInfo } from './types';
import findAndRemove from '@utils/findAndRemove';

const debugMode = false;
const debug = (...params: any[]) => debugMode && console.log(...params);
const log = (...params: any[]) => console.log(...params);

const part1 = (ticketInfo: TicketInfo) => {
  let invalidTotal = 0;

  for (const ticket of ticketInfo.otherTickets) {
    for (const value of ticket) {
      let valid = false;
      for (const rule of ticketInfo.rules) {
        for (const range of rule.validRanges) {
          if (value >= range.low && value <= range.high) {
            valid = true;
            break;
          }
        }
        if (valid) break;
      }
      if (!valid) {
        invalidTotal += value;
      }
    }
  }

  log(invalidTotal);
};

const part2 = (ticketInfo: TicketInfo) => {
  const validTickets = [ticketInfo.myTicket];

  // Find valid tickets and add them
  for (const ticket of ticketInfo.otherTickets) {
    let ticketIsValid = true;
    for (const value of ticket) {
      let valid = false;
      for (const rule of ticketInfo.rules) {
        for (const range of rule.validRanges) {
          if (value >= range.low && value <= range.high) {
            valid = true;
            break;
          }
        }
        if (valid) break;
      }
      if (!valid) ticketIsValid = false;
    }
    if (ticketIsValid) {
      validTickets.push(ticket);
    }
  }

  log(
    `${validTickets.length} / ${
      ticketInfo.otherTickets.length + 1
    } tickets valid`,
  );

  const candidateFieldIndexes: number[][] = [
    ...new Array(ticketInfo.rules.length).fill(0).map(() => []),
  ];
  const determinedFieldIndex: number[] = [
    ...new Array(ticketInfo.rules.length).fill(-1),
  ];

  // Iterate through each rule, find candidate field indexs that would be valid for this rule
  for (let ruleIndex = 0; ruleIndex < ticketInfo.rules.length; ruleIndex++) {
    for (
      let fieldIndex = 0;
      fieldIndex < ticketInfo.myTicket.length;
      fieldIndex++
    ) {
      // This field is valid for this rule if *every* ticket's value for this field can meet at least one of the ranges in the rule
      const validForAllTickets = validTickets.every((ticket) =>
        ticketInfo.rules[ruleIndex].validRanges.some(
          (r) => ticket[fieldIndex] >= r.low && ticket[fieldIndex] <= r.high,
        ),
      );
      if (validForAllTickets) candidateFieldIndexes[ruleIndex].push(fieldIndex);
    }
  }

  do {
    // Now loop over the candidates and work out what field must go where. We look for
    // candidates that only have 1 entry, which means that must be for them. We can then remove
    // that entry from other candidate arrays. We keep doing this until all are set. This only works because
    // the problem has been setup to have just one correct answer.
    const candidatesWithOneEntry = candidateFieldIndexes.filter(
      (c) => c.length === 1,
    );
    for (const candidates of candidatesWithOneEntry) {
      for (const otherCandidates of candidateFieldIndexes.filter(
        (c) => c.length > 1,
      ))
        findAndRemove(otherCandidates, (c) => c == candidates[0]);
    }
  } while (candidateFieldIndexes.some((c) => c.length > 1));

  log(candidateFieldIndexes);

  let product = 1;

  for (let ruleIndex = 0; ruleIndex < ticketInfo.rules.length; ruleIndex++) {
    const rule = ticketInfo.rules[ruleIndex];
    if (rule.field.startsWith('departure')) {
      product *= ticketInfo.myTicket[candidateFieldIndexes[ruleIndex][0]];
    }
  }

  log(product);
};

const start = async (file: string) => {
  const content = fs.readFileSync(path.join(__dirname, file), 'utf8');

  const ticketInfo = parseInput(content);

  part2(ticketInfo);
};

//start('./files/example2.txt');
start('./files/input.txt');
