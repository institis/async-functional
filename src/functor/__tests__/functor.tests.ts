/* eslint-disable */

import * as jsc from 'jsverify';
import {functor, map} from '..';
import {of} from '../../prelude';
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
