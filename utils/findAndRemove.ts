/**
 * Finds the first matching element in an array using a predicate. If found, the element is removed and returned.
 * @param array The array to compare against
 * @param predicate The predicate, every element that this returns true from will be removed until one does not
 * @returns The removed element as an array. An empty array if nothing found.
 */
const findAndRemove = <T>(array: T[], predicate: (val: T) => boolean) => {
  var index = array.findIndex(predicate);
  if (index > -1) {
    return array.splice(index, 1);
  }
  return [];
};

export default findAndRemove;
