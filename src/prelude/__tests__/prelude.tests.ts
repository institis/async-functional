/* eslint-disable */
/**
 * @copyright 2020 Yogesh Sajanikar
 */

import * as jsc from 'jsverify';
import {of, collect} from '..';

describe('Prelude', () => {
  it("=> 'of' should convert input iterator to async generator", async () => {
    expect(
      jsc.forall(jsc.array(jsc.number), async (inp: Array<number>) => {
        const result = await collect(of(inp));
        for (let index = 0; index < inp.length; index++) {
          if (inp[index] !== result[index]) return false;
        }
        return true;
      })
    ).toBeTruthy();
  });
});
