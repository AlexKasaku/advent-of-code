import fs from 'fs';
import path from 'path';
import { parseInputPart1 } from './utils';
import { init } from 'z3-solver';

const debugMode = false;
const debug = (...params: any[]) => debugMode && console.log(...params);
const log = (...params: any[]) => console.log(...params);

const start = async (file: string, boundMin: number, boundMax: number) => {
  const content = fs.readFileSync(path.join(__dirname, file), 'utf8');
  const hailstones = parseInputPart1(content);

  // Part 1 needs to be reinstated, or just go back in time in git!

  // Relies on using z3 to find the answer. Stared at this for hours and played around
  // trying to work out how this could be found using maths but struggled to come up with
  // an answer. The solution is out there - feels like a cop out but this felt more like
  // a mathematical challenge than a programming one.
  const { Context } = await init();
  const { Solver, Real } = Context('main');

  const solver = new Solver();

  // We want to find rpx, rpy, rpy, rvx, rvy, rvz that represents the starting
  // position + velocity for the rock that will collide with all the hailstones.
  const rpx = Real.const('rpx');
  const rpy = Real.const('rpy');
  const rpz = Real.const('rpz');
  const rvx = Real.const('rvx');
  const rvy = Real.const('rvy');
  const rvz = Real.const('rvz');

  // For each hailstone there must exist a t value where the rock collides with the hailstone
  // We actually only need to match against 3 hailstones as that line will extrapolate out to
  // work for all.
  for (let i = 0; i < 3; i++) {
    const hailstone = hailstones[i];

    // Separate t value for this hailstone
    const t = Real.const('t' + i);

    solver.add(t.ge(0)); // t must be greater than 0, as only looking forwards in time

    // Now add position of rock + vector (multiplied by t) so that it hits the hailstone
    solver.add(
      rpx.add(rvx.mul(t)).eq(t.mul(hailstone.vector.x).add(hailstone.point.x)),
    );
    solver.add(
      rpy.add(rvy.mul(t)).eq(t.mul(hailstone.vector.y).add(hailstone.point.y)),
    );
    solver.add(
      rpz.add(rvz.mul(t)).eq(t.mul(hailstone.vector.z).add(hailstone.point.z)),
    );
  }

  const result = await solver.check();

  if (result == 'unsat') throw 'Could not solve solution';

  const model = await solver.model();

  const solvedrpx = Number(model.eval(rpx));
  const solvedrpy = Number(model.eval(rpy));
  const solvedrpz = Number(model.eval(rpz));

  log(solvedrpx + solvedrpy + solvedrpz);

  // z3 seems to have an issue where this will hang on to all threads, will need to manually kill the proces.
};

//start('./files/example.txt', 7, 27);
start('./files/input.txt', 200000000000000, 400000000000000);
