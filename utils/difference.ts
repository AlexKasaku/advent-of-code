const difference = <T>(one: T[], two: T[]) =>
  one.filter((x) => !two.includes(x));

export default difference;
