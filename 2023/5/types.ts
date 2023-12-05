export type ItemMap = {
  source: number;
  dest: number;
  range: number;
};

export type Almanac = {
  seeds: number[];
  seedSoil: ItemMap[];
  soilFertilizer: ItemMap[];
  ferilizerWater: ItemMap[];
  waterLight: ItemMap[];
  lightTemp: ItemMap[];
  tempHumidity: ItemMap[];
  humidityLocation: ItemMap[];
};
