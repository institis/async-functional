/* eslint-disable */
/**
 * @copyright 2020 Yogesh Sajanikar
 */

import * as jsc from 'jsverify';
import {of, collect} from '..';

describe('Prelude', () => {

  it ("=> 'of' should convert input iterator to async generator", async () => {
      expect(jsc.forall(jsc.array, async (inp: Iterable<unknown>) => {
        const result = await collect(of(inp));
        return result === inp;
      })).toBeTruthy();
    });
  
});
