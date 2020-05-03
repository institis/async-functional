/* eslint-disable */
/**
 * @copyright 2020 Yogesh Sajanikar
 */

import {jsonPathNumber, jsonTransform, jsonPathBoolean} from '..';
import { functor, map } from '../../functor';
import { of, collect } from '../..';

describe('A JSON transform', () => {
  it('should map list of field maps to a single object', () => {
    const nkeyMap = jsonPathNumber('$.number', 'nkey');
    const bkeyMap = jsonPathBoolean('$.result', 'bkey');
    const transf = jsonTransform(nkeyMap, bkeyMap);
    const input = {
      number: 101.0,
      result: false,
    };
    const output = transf(input);
    expect(output['nkey']).toBeCloseTo(101.0);
    expect(output['bkey']).toBe(false);
  });

  it('should map list of field maps over composite object to a single object', () => {
    const nkeyMap = jsonPathNumber('$.number', 'nkey');
    const bkeyMap = jsonPathBoolean('$.result.status', 'bkey');
    const transf = jsonTransform(nkeyMap, bkeyMap);
    const input = {
      number: 101.0,
      result: {
          status: false 
      }
    };
    const output = transf(input);
    expect(output['nkey']).toBeCloseTo(101.0);
    expect(output['bkey']).toBe(false);
  });

  it('should map the transform over a list of objects', async () => {
    const nkeyMap = jsonPathNumber('$.number', 'nkey');
    const bkeyMap = jsonPathBoolean('$.result', 'bkey');
    const transf = jsonTransform(nkeyMap, bkeyMap);
    const input = [
      {
        number: 101.0,
        result: false,
      },
      {
        number: 301.0,
        result: true,
      },
    ];

    const asyncTransf = functor(transf);
    const output = await collect(asyncTransf(of(input)));
    expect(output).toHaveLength(2);
    expect(output[0]['nkey']).toBeCloseTo(101.0);
    expect(output[0]['bkey']).toBe(false);
    expect(output[1]['nkey']).toBeCloseTo(301.0);
    expect(output[1]['bkey']).toBe(true);
  });
});
