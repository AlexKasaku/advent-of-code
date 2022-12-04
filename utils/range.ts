const range = (start: number, stop: number) =>
  Array.from({ length: stop - start + 1 }, (_, index) => start + index);

export default range;
