import { EOL } from 'os';
import { Hand, ProcessedHand as HandWithType } from './types';
import groupByDuplicate from '@utils/groupByDuplicate';

export const parseInput = (input: string): Hand[] => {
  return input.split(EOL).map((line) => ({
    cards: line.substring(0, 5),
    bid: parseInt(line.substring(6)),
  }));
};

export const addHandTypes = (hands: Hand[]): HandWithType[] => {
  return hands.map((hand) => {
    // Determine what hand type this is. Split cards into their groups
    const cardsInHand = [...hand.cards];
    const groups = cardsInHand
      .reduce(groupByDuplicate(), [])
      .sort((a, b) => b.length - a.length);

    return { ...hand, type: getTypeFromGroups(groups) };
  });
};

const getTypeFromGroups = (groups: string[][]): number => {
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

const cardStrength = [...'123456789TJQKA'];

export const compareHands = (handOne: HandWithType, handTwo: HandWithType) => {
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
