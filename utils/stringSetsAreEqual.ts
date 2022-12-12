const stringsAreEqualSets = (a: string, b: string) => {
  const aSet = new Set(a);
  const bSet = new Set(b);
  return aSet.size === bSet.size && [...aSet].every((value) => bSet.has(value));
};

export default stringsAreEqualSets;
