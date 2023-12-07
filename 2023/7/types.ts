export type Hand = {
  cards: string;
  bid: number;
};

export type ProcessedHand = Hand & {
  type: number; // 0 = Five Of A Kind, down to 7 = High Card
};
