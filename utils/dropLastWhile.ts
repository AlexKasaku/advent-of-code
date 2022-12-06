const dropLastWhile = <T>(array: T[], predicate: (arg: T) => boolean) => {
  for (let i = 0; i < array.length; i++) {
    if (!predicate(array[array.length - 1 - i])) {
      return array.slice(0, array.length - i);
    }
  }
  return [];
};

export default dropLastWhile;
