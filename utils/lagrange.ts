/**
 * Uses lagrange interpolation to find the point at x based on [(0,n0),(1,n1),(2,n2)]
 * See https://www.codesansar.com/numerical-methods/lagrange-interpolation-method-algorithm.htm
 * @param n [n1,n2,n3] points that will be used alongside [0,1,2] for x
 * @param x The x value to use for finding the interpolated value
 * @returns The interpolated value
 */
export const lagrangeInterpolate = (n: number[], x: number): number => {
  let yp = 0;
  for (let ni = 0; ni < n.length; ni++) {
    let p = 1;
    for (let nj = 0; nj < n.length; nj++) {
      if (ni != nj) {
        p = (p * (x - nj)) / (ni - nj);
      }
    }
    yp = yp + p * n[ni];
  }
  return yp;
};
