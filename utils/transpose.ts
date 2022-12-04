const transpose = <T>(array: T[][]) =>
  array[0].map((_, colIndex) => array.map((row) => row[colIndex]));

export default transpose;
