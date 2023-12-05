import { EOL } from 'os';
import { Almanac, ItemMap } from './types';

const parseItemMaps = (input: string): ItemMap[] => {
  const regex = /((\d+) (\d+) (\d+))/g;
  const matches = [...input.matchAll(regex)];

  return matches.map((m) => ({
    source: parseInt(m[3]),
    dest: parseInt(m[2]),
    range: parseInt(m[4]),
  }));
};

export const parseInput = (input: string): Almanac => {
  const sections = input.split(EOL + EOL);

  return {
    seeds: sections[0].split(':')[1].trim().split(' ').map(Number),
    seedSoil: parseItemMaps(sections[1]),
    soilFertilizer: parseItemMaps(sections[2]),
    ferilizerWater: parseItemMaps(sections[3]),
    waterLight: parseItemMaps(sections[4]),
    lightTemp: parseItemMaps(sections[5]),
    tempHumidity: parseItemMaps(sections[6]),
    humidityLocation: parseItemMaps(sections[7]),
  };
};
