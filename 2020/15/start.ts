const debugMode = true;
const debug = (...params: any[]) => debugMode && console.log(...params);
const log = (...params: any[]) => console.log(...params);

const start = async (numbers: number[]) => {
  let turn = 0;
  const lastSpoken = new Map<number, number[]>();
  let toSpeak;

  while (turn < 30000000) {
    //if (turn % 2000000 == 0) log(`Turn: ${turn}`);

    if (numbers.length > 0) {
      // First read out the numbers
      toSpeak = numbers.shift();
    } else {
      // Run out of numbers, now consider the last number
      const lastSpokenForNumber = (lastSpoken.get(toSpeak!) ?? []) as number[];
      if (lastSpokenForNumber.length > 1) {
        toSpeak = lastSpokenForNumber[1] - lastSpokenForNumber[0];
      } else toSpeak = 0;
    }

    const lastSpokenForNumber = lastSpoken.get(toSpeak!) ?? [];
    lastSpoken.set(toSpeak!, [
      ...lastSpokenForNumber.slice(lastSpokenForNumber.length - 1),
      turn,
    ]);

    turn++;
  }

  log(toSpeak);
};

//start([0, 3, 6]);
start([18, 11, 9, 0, 5, 1]);
