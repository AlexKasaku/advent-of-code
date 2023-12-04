const equation =
  '(10 * (((131234706858508 - ((((((((924 + ((150 + (((2 * (((905 + (((((((((((((2 * ((((3 * (((((((854 + (((37 * ((((((341 + (((7 * (187 + ((28 + (((((((556 + ((((x - 332) * 36) + 685) / 5)) * 2) - 737) + 978) + 164) / 3) - 16)) / 3))) - 849) * 2)) + 748) / 7) - 349) / 4) + 793)) - 61) / 7)) * 8) - 983) / 7) + 974) * 2) - 531)) + 181) / 2) - 548)) + 750) / 2) - 657) / 11) + 85) * 28) + 877) + 709) / 3) - 430) * 2) + 839)) / 2) - 60)) - 635) * 2)) / 4)) * 2) - 478) / 2) - 818) / 3) + 39) * 7)) / 5) + 553))';
const expected = 46779208742730;

let lowerX = 0;
let upperX = 46779208742730;

const resultLower = 0;
const resultUpper = 0;

let i = 100;
while (i--) {
  console.log(`Testing: ${lowerX} < x < ${upperX} (${upperX - lowerX})`);

  const testX = Math.floor((lowerX + upperX) / 2);
  const resultX = eval(equation.replace('x', testX.toString()));

  if (resultX == expected) {
    console.log('X = ' + testX);
    break;
  }
  if (resultX < expected) upperX = testX;
  else lowerX = testX;
}
