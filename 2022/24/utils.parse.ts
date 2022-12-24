export const parseInput = (input: string): InitialSetup => {
  const gridContent = input.split(EOL).map((line) => line.split(''));

  const start = { x: 1, y: 0 };
  const end = {
    x: gridContent[0].length - 2,
    y: gridContent.length - 1,
  };

  const height = gridContent.length;
  const width = gridContent[0].length;

  const blizzards: Blizzard[] = [];
  for (let y = 0; y < gridContent.length; y++)
    for (let x = 0; x < gridContent[y].length; x++) {
      switch (gridContent[y][x]) {
        case '^':
          blizzards.push({
            start: { x, y },
            current: { x, y },
            direction: 'U',
          });
          break;
        case 'v':
          blizzards.push({
            start: { x, y },
            current: { x, y },
            direction: 'D',
          });
          break;
        case '<':
          blizzards.push({
            start: { x, y },
            current: { x, y },
            direction: 'L',
          });
          break;
        case '>':
          blizzards.push({
            start: { x, y },
            current: { x, y },
            direction: 'R',
          });
          break;
      }
    }

  return { width, height, start, end, blizzards };
};
