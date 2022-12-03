import fs from "fs";
import { EOL } from "os";
import path from "path";

const start = async () => {
  const content = fs.readFileSync(path.join(__dirname, "1.input.txt"), "utf8");

  const elves = content.split(EOL + EOL);
  const totals = elves.map((elf) =>
    elf
      .split(EOL)
      .map((x) => parseInt(x))
      .reduce((x, y) => x + y)
  );

  const topThree = totals.sort((n1, n2) => n2 - n1).slice(0, 3);
  const combined = topThree.reduce((x, y) => x + y);

  console.log(topThree);
  console.log(combined);
};

start();
