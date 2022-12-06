const dropWhile = <T>(array: T[], predicate: (arg: T) => boolean) => {
  for (let i = 0; i < array.length; i++) {
    if (!predicate(array[i])) {
      return array.slice(i);
    }
  }

  return [];
};

export default dropWhile;
