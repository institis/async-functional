/* eslint-disable */
/**
 * @copyright 2020 Yogesh Sajanikar
 */

import * as fc from 'fast-check';
import {of, collect, take, id, compose} from '..';

describe('Prelude', () => {
  it('should have same length for collection of async generator as that of input', async () => {
    const result = fc.asyncProperty(fc.array(fc.nat()), async inp => {
      const result = await collect(of(inp));
      for (let index = 0; index < inp.length; index++) {
        if (inp[index] !== result[index]) return false;
      }
      return true;
    });
    await fc.assert(result);
  });

  it('should take same number of element as that of array slice', async () => {
    const result = fc.asyncProperty(
      fc.array(fc.nat()),
      fc.nat(),
      async (input, subset) => {
        const result = await collect(take(of(input), subset));
        const min = Math.min(input.length, subset);
        return result.length == min;
      }
    );
    await fc.assert(result);
  });

  it('should map input identically with id function', async () => {
    const result = fc.asyncProperty(fc.array(fc.nat()), async input => {
      const result = await collect(id(of(input)));
      if (result.length != input.length) return false;

      for (let index = 0; index < input.length; index++) {
        if (result[index] != input[index]) return false;
      }

      return true;
    });

    await fc.assert(result);
  });

  it('should asynchronously compose two generators as composition of two functions', async () => {
    const result = fc.property(fc.nat(), value => {
      const square = (x: number) => x * x;
      const add10 = (x: number) => x + 10;
      const squareAndAdd10 = compose(square, add10);
      return add10(square(value)) == squareAndAdd10(value);
    });

    fc.assert(result);
  });
});
