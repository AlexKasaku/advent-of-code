export type GameSetup = {
  id: number;
  rounds: GameRound[];
};

export type GameRound = {
  blue: number;
  red: number;
  green: number;
};
