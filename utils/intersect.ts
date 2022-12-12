const intersect = <T>(one: T[], two: T[]) => one.filter((x) => two.includes(x));

export default intersect;
