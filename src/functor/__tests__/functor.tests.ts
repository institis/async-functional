/* eslint-disable */

import * as jsc from 'jsverify';
import {functor, map, zip} from '..';
import {of, compose, collect} from '../../prelude';
import {logger} from '../../logging';

describe('A functor', () => {
  jsc.property('map(fn) == fn(map(id))', jsc.array(jsc.nat), async input => {
    const iterator = of(input);
    const fn = (x: number) => x * x;
    const outiterator = map(fn, iterator);
    const expected = map(x => x, of(input));

    let index = 0;
    for await (const out of outiterator) {
      if (fn(input[index]) != out) return false;
      index++;
    }

    return index == input.length;
  });

  jsc.property(
    'functor(compose(fn1, fn2)) == compose(functor(fn2), functor(fn1))',
    jsc.array(jsc.number),
    async input => {
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
    }
  );

  jsc.property(
    'length(zip(array1,array2)) == min(array1.length, array2.length)',
    jsc.tuple([jsc.array(jsc.nat), jsc.array(jsc.nat)]),
    async input => {
      const iterator1 = of(input[0]);
      const iterator2 = of(input[1]);
      const zipped = zip(iterator1, iterator2);
      const zippedArray = await collect(zipped);
      if (zippedArray.length != Math.min(input[0].length, input[1].length))
        return false;

      for (let index = 0; index < zippedArray.length; index++) {
        if (input[0][index] != zippedArray[index][0]) return false;
        if (input[1][index] != zippedArray[index][1]) return false;
      }
      return true;
    }
  );

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
