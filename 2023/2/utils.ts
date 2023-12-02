import { EOL } from 'os';
import { GameRound, GameSetup } from './types';

export const parseInput = (input: string): GameSetup[] => {
  // Parse line: Game 8: 3 red, 7 green, 3 blue; 2 green, 3 blue, 3 red; 3 blue, 4 green, 1 red; 3 blue, 3 red; 2 blue, 6 green; 2 red, 7 green, 1 blue

  return input.split(EOL).map((line) => {
    const parts = line.split(':');

    const id = parseInt(parts[0].substring(5));

    const roundData = parts[1].split(';');

    const rounds = roundData.map((round) => {
      // Parse lines like:
      // 3 red, 7 green, 3 blue
      // 2 green, 3 blue, 3 red
      // 3 blue, 4 green, 1 red;
      const cubeParts = round.trim().split(',');
      const roundInfo: GameRound = { red: 0, green: 0, blue: 0 };

      for (const cubeData of cubeParts) {
        // We need to determine colour and number, the order is not guaranteed each round.
        const cubeDataEntry = cubeData.trim().split(' ');
        const value = parseInt(cubeDataEntry[0]);

        switch (cubeDataEntry[1]) {
          case 'red':
            roundInfo.red = value;
            break;
          case 'blue':
            roundInfo.blue = value;
            break;
          case 'green':
            roundInfo.green = value;
            break;
        }
      }

      return roundInfo;
    });

    return {
      id,
      rounds,
    };
  });
};
