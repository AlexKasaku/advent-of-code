const debugMode = true;
const debug = (...params: any[]) => debugMode && console.log(...params);
const log = (...params: any[]) => console.log(...params);

const start = async (numbers: number[]) => {
  let turn = 0;
  const lastSpoken = new Map<number, number[]>();
  let toSpeak;

  while (turn < 2020) {
    if (numbers.length > 0) {
      // First read out the numbers
      toSpeak = numbers.shift();
    } else {
      // Run out of numbers, now consider the last number
      //toSpeak = turn - 1 - (lastSpoken.get(toSpeak!) ?? 0);
      const lastSpokenForNumber = (lastSpoken.get(toSpeak!) ?? []) as number[];
      if (lastSpokenForNumber.length > 1)
        toSpeak =
          turn - 1 - lastSpokenForNumber[lastSpokenForNumber.length - 2];
      else toSpeak = 0;
    }

    debug(toSpeak);
    const lastSpokenForNumber = lastSpoken.get(toSpeak!) ?? [];
    lastSpoken.set(toSpeak!, [...lastSpokenForNumber, turn]);
    //debug(lastSpoken);

    turn++;
  }
};

//start([0, 3, 6]);
start([18, 11, 9, 0, 5, 1]);
