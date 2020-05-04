/* eslint-disable */
/**
 * @copyright 2020 Yogesh Sajanikar
 */

import {Pipe} from '..';
import { of, collect } from '../..';

describe('A pipe', () => {
  it('should run operations in sequence', async () => {
    const input = [1, 2, 3, 4, 5];
    const pipe = Pipe.liftFunction((u: number) => 2 * u).map(u => u * u);
    const output = await collect(pipe.run(of(input)));
    expect(output).toHaveLength(input.length);
    expect(output[0]).toBe(4);
    expect(output[1]).toBe(16);
    expect(output[2]).toBe(36);
    expect(output[3]).toBe(64);
    expect(output[4]).toBe(100);
  });
});
