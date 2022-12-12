const findAndRemove = <T>(array: T[], predicate: (val: T) => boolean) => {
  var index = array.findIndex(predicate);
  if (index > -1) {
    return array.splice(index, 1);
  }
  return [];
};

export default findAndRemove;
