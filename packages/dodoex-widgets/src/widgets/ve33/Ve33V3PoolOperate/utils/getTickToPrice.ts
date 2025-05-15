/* eslint-disable no-plusplus */
import JSBI from 'jsbi';
import { TickMath } from './tickMath';
import { Q192 } from './constants';
import { sortsBefore } from '../../../../utils';
import { TokenInfo } from '../../../../hooks/Token';
import BigNumber from 'bignumber.js';
import { encodeSqrtRatioX96 } from './encodeSqrtRatioX96';
import { Price } from '../../../../utils/fractions';

/**
 * Returns the first tick for which the given price is greater than or equal to the tick price
 * @param price for which to return the closest tick that represents a price less than or equal to the input price,
 * i.e. the price of the returned tick is less than or equal to the input price
 */
export function priceToClosestTick(price: Price): number {
  const sorted = sortsBefore(price.baseCurrency, price.quoteCurrency);
  const sqrtRatioX96 = sorted
    ? encodeSqrtRatioX96(price.numerator, price.denominator)
    : encodeSqrtRatioX96(price.denominator, price.numerator);

  let tick = TickMath.getTickAtSqrtRatio(sqrtRatioX96);
  const nextTickPrice = tickToPrice(
    price.baseCurrency,
    price.quoteCurrency,
    tick + 1,
  );
  if (sorted) {
    if (!price.lessThan(nextTickPrice)) {
      tick++;
    }
  } else {
    if (!price.greaterThan(nextTickPrice)) {
      tick++;
    }
  }
  return tick;
}

export function tickToPrice(
  baseToken: TokenInfo,
  quoteToken: TokenInfo,
  tickCurrent: number | bigint,
) {
  const sqrtRatioX96 = TickMath.getSqrtRatioAtTick(Number(tickCurrent));
  const ratioX192 = JSBI.multiply(sqrtRatioX96, sqrtRatioX96);

  return sortsBefore(baseToken, quoteToken)
    ? new Price(baseToken, quoteToken, Q192, ratioX192)
    : new Price(baseToken, quoteToken, ratioX192, Q192);
}

export function getTickToPrice(
  baseToken?: TokenInfo,
  quoteToken?: TokenInfo,
  tickCurrent?: number | bigint,
) {
  if (!baseToken || !quoteToken || tickCurrent === undefined) {
    return undefined;
  }
  const sqrtRatioX96 = TickMath.getSqrtRatioAtTick(Number(tickCurrent));
  const ratioX192 = JSBI.multiply(sqrtRatioX96, sqrtRatioX96);
  const decimals = 10 ** quoteToken.decimals / 10 ** baseToken.decimals;
  return sortsBefore(baseToken, quoteToken)
    ? new BigNumber(ratioX192.toString())
        .div(Q192.toString())
        .div(decimals)
        .toString()
    : new BigNumber(Q192.toString())
        .div(ratioX192.toString())
        .div(decimals)
        .toString();
}
