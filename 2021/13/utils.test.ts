import { foldOn } from './utils';

describe('foldOn', () => {
  test('xAxis', () => {
    expect(foldOn([[true, false, false, false, true]], true, 2)).toEqual([
      [true, false],
    ]);
    expect(foldOn([[false, false, false, false, true]], true, 2)).toEqual([
      [true, false],
    ]);
    expect(foldOn([[true, false, false, false, true]], true, 3)).toEqual([
      [true, false, true],
    ]);
  });

  test('yAxis', () => {
    expect(
      foldOn([[true], [false], [false], [false], [true]], false, 2),
    ).toEqual([[true], [false]]);
    expect(
      foldOn([[false], [false], [false], [false], [true]], false, 2),
    ).toEqual([[true], [false]]);
    expect(
      foldOn([[true], [false], [false], [false], [true]], false, 3),
    ).toEqual([[true], [false], [true]]);
  });
});
