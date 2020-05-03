/* eslint-disable */

import * as fc from 'fast-check';
import {functor, map, zip, filter, zipWith} from '..';
import {of, compose, collect} from '../../prelude';
import {logger} from '../../logging';
import {fold} from '../../folds';

describe('A functor', () => {
  it('should map a function over the collection', async () => {
    const result = fc.asyncProperty(
      fc.array(fc.nat()),
      async (input: number[]) => {
        const iterator = of(input);
        const fn = (x: number) => x * x;
        const outiterator = map(fn, iterator);
        let index = 0;
        for await (const out of outiterator) {
          if (fn(input[index]) != out) return false;
          index++;
        }
        return index == input.length;
      }
    );

    await fc.assert(result);
  });

  it('should compose two functions in the same way as composition of functors over two functions', async () => {
    const result = fc.asyncProperty(fc.array(fc.nat()), async input => {
      const square = (x: number) => x * x;
      const add10 = (x: number) => x + 10;
      const squareFunctor = functor(square);
      const add10Functor = functor(add10);
      const squareFunctorAdd10FunctorFunctor = compose(
        squareFunctor,
        add10Functor
      );
      const squareAndAdd10 = compose(square, add10);
      const squareAndAdd10Functor = functor(squareAndAdd10);
      const funccompose = await collect(squareAndAdd10Functor(of(input)));
      const composefunc = await collect(
        squareFunctorAdd10FunctorFunctor(of(input))
      );
      if (
        !(
          input.length == funccompose.length &&
          funccompose.length == composefunc.length
        )
      )
        return false;
      for (let index = 0; index < input.length; index++) {
        if (funccompose[index] != composefunc[index]) return false;
      }
      return true;
    });
    await fc.assert(result);
  });

  it("should have length of zip of two array same as the length of the shorter array", async () => {
    const result = fc.asyncProperty(fc.array(fc.nat()), fc.array(fc.nat()),
      async (f, s) => {
        const iterator1 = of(f);
        const iterator2 = of(s);
        const zipped = zip(iterator1, iterator2);
        const zippedArray = await collect(zipped);
        if (zippedArray.length != Math.min(f.length, s.length))
          return false;
  
        for (let index = 0; index < zippedArray.length; index++) {
          if (f[index] != zippedArray[index][0]) return false;
          if (s[index] != zippedArray[index][1]) return false;
        }
        return true;
      }
    );
    await fc.assert(result);
    })

  it('should zip two lists with with an operator', async () => {
    const result = fc.asyncProperty(
      fc.array(fc.nat()),
      fc.array(fc.nat()),
      async (f, s) => {
        const add = (i: number, j: number) => i + j;
        const l = Math.min(f.length, s.length);
        const sum = f.slice(0, l).reduce(add, 0) + s.slice(0, l).reduce(add, 0);
        const actual = await fold(add, 0,  zipWith((ff, ss) => ff + ss, of(f), of(s)));
        return actual === sum;
      }
    );

    await fc.assert(result);
  });

  it('filter the input in the same way as filtering the mapped input', async () => {
    const result = fc.asyncProperty(fc.array(fc.nat()), async input => {
      const isOdd = (x: number) => x % 2 != 0;
      const isEven = (x: number) => !isOdd(x);

      const odds = filter(isOdd, of(input));
      const evens = filter(isEven, odds);

      const nothings = await collect(evens);
      return nothings.length == 0;
    });
    await fc.assert(result);
  });

  it('should numbers to squares', async () => {
    const iterator = of([1, 2, 3, 4, 5]);
    const output = [1, 4, 9, 16, 25];
    let index = 0;
    for await (const i of map(x => x * x, iterator)) {
      expect(i).toBe(output[index]);
      index = index + 1;
    }
  });

  it('should also lift function to functor', async () => {
    const iterator = of([1, 2, 3, 4, 5]);
    const output = [1, 4, 9, 16, 25];
    const squareMap = functor((x: number) => x * x);
    let index = 0;
    for await (const i of squareMap(iterator)) {
      logger.debug('Mapped values', {value: i});
      expect(i).toBe(output[index]);
      index = index + 1;
    }
  });
});
