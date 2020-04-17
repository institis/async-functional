/* eslint-disable */
import {functor, map} from '..';
import {of} from '../../prelude';
import {logger} from '../../logging';

describe('A functor', () => {
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
