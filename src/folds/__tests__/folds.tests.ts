/* eslint-disable */
/**
 * @copyright 2020 Yogesh Sajanikar
 */

import * as fc from 'fast-check';
import {of} from '../..';
import {fold} from '..';

describe('A fold', () => {
  it('should fold over each element of the input', async () => {
    const verified = fc.asyncProperty(fc.array(fc.nat()), async input => {
      let sum = input.reduce((i, j) => i + j, 0);
      const inputG = of(input);
      const actual = await fold(
        (s, v) => {
          return s + v;
        },
        0,
        inputG
      );
      return actual === sum;
    //   expect(actual).toBe(sum);
    });
    await fc.assert(verified);
  });
});
