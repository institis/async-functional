/* eslint-disable */
/**
 * @copyright 2020 Yogesh Sajanikar
 */

import {jsonPathNumber, jsonTransform, jsonPathBoolean} from '..';

describe('A JSON transform', () => {
  it('should map list of field maps to a single object', () => {
    const nkeyMap = jsonPathNumber('$.number', 'nkey');
    const bkeyMap = jsonPathBoolean('$.result', 'bkey');
    const transf = jsonTransform(nkeyMap, bkeyMap);
    const input = {
      number: 101.0,
      result: false
    };
    const output = transf(input);
    expect(output['nkey']).toBeCloseTo(101.0);
    expect(output['bkey']).toBe(false);
  });
});
