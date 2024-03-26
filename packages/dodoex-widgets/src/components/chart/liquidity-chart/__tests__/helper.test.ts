import BigNumber from 'bignumber.js';
import { computeTargetPrice } from '../helper';

describe('computeTargetPrice', () => {
  test.skip('skipped test', () => {
    const result = computeTargetPrice({
      x: 50,
      width: 100,
      minXLN10: new BigNumber('-1'),
      maxXLN10: new BigNumber('1'),
    });
    console.log(result.toString());
    expect(result.toString()).toEqual('1');
  });
});
