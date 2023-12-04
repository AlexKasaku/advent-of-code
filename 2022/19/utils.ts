import { EOL } from 'os';
import { Blueprint, State } from './types';

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

const stateToSetString = ({ resources, robots, timeRemaining }: State) =>
  [
    resources.ore,
    resources.clay,
    resources.obsidian,
    resources.geode,
    robots.ore,
    robots.clay,
    robots.obsidian,
    robots.geode,
    timeRemaining,
  ].join(',');

export const calculateBestGeodeCount = (
  blueprint: Blueprint,
  timeLimit: number,
) => {
  const stack: State[] = [
    {
      timeRemaining: timeLimit,
      previouslySkipped: {},
      robots: { ore: 1, clay: 0, obsidian: 0, geode: 0 },
      resources: { ore: 0, clay: 0, obsidian: 0, geode: 0 },
    },
  ];

  let highestGeodeCount = 0;
  let statesProcessed = 0;

  const seenStates = new Set<string>();

  while (stack.length > 0) {
    statesProcessed++;

    // Get the current state
    const currentState = stack.pop()!;

    // Skip this state if we've seen it before. This reduces the states processed but seems to be 2x slower?
    // const stateKey = [
    //   currentState.resources.ore,
    //   currentState.resources.clay,
    //   currentState.resources.obsidian,
    //   currentState.resources.geode,
    //   currentState.robots.ore,
    //   currentState.robots.clay,
    //   currentState.robots.obsidian,
    //   currentState.robots.geode,
    //   currentState.timeRemaining,
    // ].join(',');
    // if (seenStates.has(stateKey)) continue;
    // seenStates.add(stateKey);

    // Determine next possible actions, if there's time remaining
    const nextStates =
      currentState.timeRemaining > 0
        ? getPossibleStates(currentState, blueprint, highestGeodeCount)
        : [];

    if (nextStates.length > 0) {
      stack.push(...nextStates);
    } else {
      // No more future states, return the highest geode count.
      if (currentState.resources.geode > highestGeodeCount) {
        highestGeodeCount = currentState.resources.geode;
        //console.log(`[${blueprint.id}] New highest = ${highestGeodeCount}`);
        //console.log(currentState);
      }
    }
  }

  console.log(`Processed ${(statesProcessed / 1000000).toFixed(2)}M states`);

  return highestGeodeCount;
};

const getPossibleStates = (
  currentState: State,
  blueprint: Blueprint,
  highestGeodeCount: number,
): State[] => {
  const states: State[] = [];

  const resourcesAfterToday = {
    ore: currentState.resources.ore + currentState.robots.ore,
    clay: currentState.resources.clay + currentState.robots.clay,
    obsidian: currentState.resources.obsidian + currentState.robots.obsidian,
    geode: currentState.resources.geode + currentState.robots.geode,
  };

  const canBuildOre = currentState.resources.ore >= blueprint.oreRobot.ore;
  const canBuildClay = currentState.resources.ore >= blueprint.clayRobot.ore;
  const canBuildObsidian =
    currentState.resources.ore >= blueprint.obsidianRobot.ore &&
    currentState.resources.clay >= blueprint.obsidianRobot.clay;
  const canBuildGeode =
    currentState.resources.ore >= blueprint.geodeRobot.ore &&
    currentState.resources.obsidian >= blueprint.geodeRobot.obsidian;

  // Optimization - Don't build more robots if we already generate enough for the highest cost of a robot
  const maxOreRequirement = Math.max(
    blueprint.oreRobot.ore,
    blueprint.clayRobot.ore,
    blueprint.obsidianRobot.ore,
    blueprint.geodeRobot.ore,
  );
  const maxClayRequirement = blueprint.obsidianRobot.clay;
  const maxObsidianRequirement = blueprint.geodeRobot.obsidian;

  // Optimization - always build a geode robot if we can and don't bother with any other states
  if (canBuildGeode) {
    states.push({
      timeRemaining: currentState.timeRemaining - 1,
      previouslySkipped: {},
      resources: {
        ...resourcesAfterToday,
        ore: resourcesAfterToday.ore - blueprint.geodeRobot.ore,
        obsidian: resourcesAfterToday.obsidian - blueprint.geodeRobot.obsidian,
      },
      robots: {
        ...currentState.robots,
        geode: currentState.robots.geode + 1,
      },
    });

    // If you can build a geode robot, do this over anything else!
    return states;
  }

  // Optimization, if there are 2 or fewer minutes left, don't bother building anything else as it won't
  // result in more geodes
  if (
    currentState.timeRemaining >= 2 &&
    canBuildObsidian &&
    currentState.robots.obsidian < maxObsidianRequirement &&
    !currentState.previouslySkipped.obsidian
  ) {
    // Build an obsidian robot
    states.push({
      timeRemaining: currentState.timeRemaining - 1,
      previouslySkipped: {},
      resources: {
        ...resourcesAfterToday,
        ore: resourcesAfterToday.ore - blueprint.obsidianRobot.ore,
        clay: resourcesAfterToday.clay - blueprint.obsidianRobot.clay,
      },
      robots: {
        ...currentState.robots,
        obsidian: currentState.robots.obsidian + 1,
      },
    });
  }

  // Optimization, don't build clay robots if we're already at our max of obsidian robots
  if (
    currentState.timeRemaining >= 2 &&
    canBuildClay &&
    currentState.robots.obsidian < maxObsidianRequirement &&
    currentState.robots.clay < maxClayRequirement &&
    !currentState.previouslySkipped.clay
  )
    // Build a clay robot
    states.push({
      previouslySkipped: {},
      timeRemaining: currentState.timeRemaining - 1,
      resources: {
        ...resourcesAfterToday,
        ore: resourcesAfterToday.ore - blueprint.clayRobot.ore,
      },
      robots: {
        ...currentState.robots,
        clay: currentState.robots.clay + 1,
      },
    });

  if (
    currentState.timeRemaining >= 2 &&
    currentState.resources.ore >= blueprint.oreRobot.ore &&
    currentState.robots.ore < maxOreRequirement &&
    !currentState.previouslySkipped.ore
  )
    // Build an ore robot
    states.push({
      timeRemaining: currentState.timeRemaining - 1,
      previouslySkipped: {},
      resources: {
        ...resourcesAfterToday,
        ore: resourcesAfterToday.ore - blueprint.oreRobot.ore,
      },
      robots: {
        ...currentState.robots,
        ore: currentState.robots.ore + 1,
      },
    });

  // Also push the state where we don't do anything

  // Optimization, for non-geode robots, remember that we've skipped building one that we could
  // do this round, so don't that type until we've built another

  // Optimization, if we can build any kind of robot and there is time left, don't explore the state
  // where we skip doing so
  if (
    !(canBuildOre && canBuildClay && canBuildObsidian) ||
    currentState.timeRemaining < 2
  )
    states.push({
      timeRemaining: currentState.timeRemaining - 1,
      previouslySkipped: {
        ore: canBuildOre,
        clay: canBuildClay,
        obsidian: canBuildObsidian,
      },
      resources: {
        ...resourcesAfterToday,
      },
      robots: {
        ...currentState.robots,
      },
    });

  return states;
};
