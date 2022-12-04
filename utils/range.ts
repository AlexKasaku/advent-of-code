const range = (start: number, stop: number) => {
  const delta = stop > start ? 1 : -1;
  return Array.from(
    { length: Math.abs(stop - start) + 1 },
    (_, index) => start + index * delta
  );
};

export default range;
