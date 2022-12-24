const getRenderChar = (space: Space): string => {
  if (space.start || space.end) return '.';
  if (space.wall) return '#';
  if (space.blizzards.length > 1) return space.blizzards.length.toString();
  if (space.blizzards.length == 0) return '.';

  switch (space.blizzards[0].direction) {
    case 'U':
      return '^';
    case 'R':
      return '>';
    case 'D':
      return 'v';
    case 'L':
      return '<';
  }
};

export const renderGrid = (grid: Grid<Space>): void => {
  for (const row of grid.Values) {
    for (const space of row) {
      process.stdout.write(getRenderChar(space));
    }
    console.log();
  }
};
