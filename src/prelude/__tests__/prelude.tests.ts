/* eslint-disable */
/**
 * @copyright 2020 Yogesh Sajanikar
 */

import * as jsc from 'jsverify';
import {of, collect, take} from '..';

const arbitrayArraySubset = jsc.array(jsc.number);

describe('Prelude', () => {
  jsc.property('collect(of(input)) == input', jsc.array(jsc.nat), async inp => {
    const result = await collect(of(inp));
    for (let index = 0; index < inp.length; index++) {
      if (inp[index] !== result[index]) return false;
    }
    return true;
  });

  jsc.property('input[slice] == take(input, slice)', jsc.array(jsc.nat),jsc.nat, async (input, subset) => {
    const result = await collect(take(of(input), subset));
    const min = Math.min(input.length, subset);
    return result.length == min;
  });

});
