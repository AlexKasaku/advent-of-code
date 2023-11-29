/**
 * Returns an array of numbers that range from start to stop, inclusive. Will also work in reverse order
 * @param start The starting number of the range
 * @param stop The ending number of the range
 * @returns An array of the range
 * @example
 * range(5,7)
 * // ==> [5, 6, 7]
 *
 * range(-3,-1)
 * // ==> [-3, -2, -1]
 */
const range = (start: number, stop: number) => {
  const delta = stop > start ? 1 : -1;
  return Array.from(
    { length: Math.abs(stop - start) + 1 },
    (_, index) => start + index * delta
  );
};

export default range;
