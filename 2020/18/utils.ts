import { EOL } from 'os';

export const parseInput = (input: string): string[] => {
  return input.split(EOL);
};

export const calculateExpression = (
  expression: string,
  additionFirst: boolean = false,
): number => {
  if (expression.match(/[()]/)) throw 'Expression contains parentheses';

  let workingExpression = expression;

  if (additionFirst) {
    while (workingExpression.indexOf('+') > -1) {
      const nextExpression = workingExpression.replaceAll(
        /\d+ \+ \d+/g,
        (subExpression) => calculateExpression(subExpression).toString(),
      );

      workingExpression = nextExpression;
    }
  }

  const sections = workingExpression.split(' ');
  let total = parseInt(sections[0]);

  for (let index = 1; index < sections.length; index += 2) {
    const operator = sections[index];
    const operand = parseInt(sections[index + 1]);

    switch (operator) {
      case '+':
        total += operand;
        break;
      case '*':
        total *= operand;
        break;
    }
  }

  return total;
};

export const processString = (
  expression: string,
  additionFirst: boolean = false,
): number => {
  let workingExpression = expression;
  while (workingExpression.indexOf('(') > -1) {
    const nextExpression = workingExpression.replaceAll(
      /\([0-9 */+-]+\)/g,
      (subExpression) =>
        calculateExpression(
          subExpression.substring(1, subExpression.length - 1),
          additionFirst,
        ).toString(),
    );

    workingExpression = nextExpression;
  }
  // All parentheses should be removed
  return calculateExpression(workingExpression, additionFirst);
};
