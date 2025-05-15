import BigNumber from 'bignumber.js';
import { Percent } from '../../../../utils/fractions';

const PRECISION = 10_000;
const DENOMINATOR = PRECISION * 100;

// turn "0.5" into Percent representing 0.5%
export function toSlippagePercent(slippage: string | number): Percent {
  const numerator = Math.floor(Number(slippage) * PRECISION);
  return new Percent(numerator, DENOMINATOR);
}

// turn "0.5" into Percent representing 0.5%
export function toSlippagePercentNumber(slippage: string | number): number {
  const numerator = Math.floor(Number(slippage) * PRECISION);
  return new BigNumber(numerator).div(DENOMINATOR).toNumber();
}
