const intersect = (one: number[], two: number[]) =>
  one.filter((x) => two.includes(x));

export default intersect;
