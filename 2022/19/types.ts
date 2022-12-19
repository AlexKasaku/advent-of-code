export type Blueprint = {
  id: number;
  oreRobot: { ore: number };
  clayRobot: { ore: number };
  obsidianRobot: { ore: number; clay: number };
  geodeRobot: { ore: number; obsidian: number };
};
