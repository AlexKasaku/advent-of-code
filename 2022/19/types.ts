export type Blueprint = {
  id: number;
  oreRobot: { ore: number };
  clayRobot: { ore: number };
  obsidianRobot: { ore: number; clay: number };
  geodeRobot: { ore: number; obsidian: number };
};

export type State = {
  timeRemaining: number;
  previouslySkipped: {
    ore?: boolean;
    clay?: boolean;
    obsidian?: boolean;
  };
  robots: {
    ore: number;
    clay: number;
    obsidian: number;
    geode: number;
  };
  resources: {
    ore: number;
    clay: number;
    obsidian: number;
    geode: number;
  };
};
