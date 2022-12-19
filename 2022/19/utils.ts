import { EOL } from 'os';
import { Blueprint } from './types';

export const parseInput = (input: string): Blueprint[] =>
  input.split(EOL).map((line, index) => {
    const lineRegex =
      /Each ore robot costs (?<oreRobotOre>\d+) ore\. Each clay robot costs (?<clayRobotOre>\d+) ore\. Each obsidian robot costs (?<obsidianRobotOre>\d+) ore and (?<obsidianRobotClay>\d+) clay\. Each geode robot costs (?<geodeRobotOre>\d+) ore and (?<geodeRobotObsidian>\d+) obsidian/gi;

    const match = lineRegex.exec(line);

    if (!match || !match.groups)
      throw 'Could not parse input for line: [' + line + ']';

    const {
      oreRobotOre,
      clayRobotOre,
      obsidianRobotOre,
      obsidianRobotClay,
      geodeRobotOre,
      geodeRobotObsidian,
    } = match.groups;

    return {
      id: index + 1,
      oreRobot: { ore: parseInt(oreRobotOre) },
      clayRobot: { ore: parseInt(clayRobotOre) },
      obsidianRobot: {
        ore: parseInt(obsidianRobotOre),
        clay: parseInt(obsidianRobotClay),
      },
      geodeRobot: {
        ore: parseInt(geodeRobotOre),
        obsidian: parseInt(geodeRobotObsidian),
      },
    };
  });
