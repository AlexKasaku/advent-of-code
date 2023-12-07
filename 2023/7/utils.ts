import { EOL } from 'os';
import { Hand, ProcessedHand as HandWithType } from './types';
import groupByDuplicate from '@utils/groupByDuplicate';

export const parseInput = (input: string): Hand[] => {
  return input.split(EOL).map((line) => ({
    cards: line.substring(0, 5),
    bid: parseInt(line.substring(6)),
  }));
};

export const addHandTypes = (
  hands: Hand[],
  jackIsWild: boolean,
): HandWithType[] => {
  return hands.map((hand) => {
    // Determine what hand type this is.

    // If Jacks (Jokers) are wild, remove them first.
    const numberOfJokers = jackIsWild
      ? [...hand.cards.matchAll(/J/g)].length
      : 0;
    const newHand = jackIsWild ? hand.cards.replaceAll('J', '') : hand.cards;

    // Split cards into their groups.
    const cardsInHand = [...newHand];
    const groups = cardsInHand
      .reduce(groupByDuplicate(), [])
      .sort((a, b) => b.length - a.length);

    return { ...hand, type: getTypeFromGroups(groups, numberOfJokers) };
  });
};

const getTypeFromGroups = (groups: string[][], jokers: number): number => {
  // Check for a hand of all jokers, which is five of a kind!
  if (jokers == 5) return 0;

  // If not just jokers, add jokers to first group to create strongest hand
  groups[0].push(...[...new Array(jokers)].fill('J'));

  if (groups.length === 1) return 0; // Five Of A Kind
  if (groups.length === 2)
    if (groups[0].length === 4) return 1; // Four Of A Kind
    else return 2; // Full House
  if (groups.length === 3)
    if (groups[0].length === 3) return 3; // Three Of A Kind
    else return 4; // Two Pair
  if (groups.length === 4) return 5; // One Pair
  return 6; // High Card
};

export const createHandComparer = (jackIsWild: boolean) => {
  const cardStrength = jackIsWild ? [...'J23456789TQKA'] : [...'23456789TJQKA'];

  return (handOne: HandWithType, handTwo: HandWithType) => {
    // If types are different, return one with higher type rank
    if (handOne.type != handTwo.type) return handOne.type - handTwo.type;

    // If types are same, need to compare cards in positions
    for (let index = 0; index < handOne.cards.length; index++) {
      const cardOneStrength = cardStrength.indexOf(handOne.cards[index]);
      const cardTwoStrength = cardStrength.indexOf(handTwo.cards[index]);

      // If strengths are different, order hands based on the one with stronger card in this position
      if (cardOneStrength != cardTwoStrength)
        return cardTwoStrength - cardOneStrength;
    }

    return 0;
  };
};
