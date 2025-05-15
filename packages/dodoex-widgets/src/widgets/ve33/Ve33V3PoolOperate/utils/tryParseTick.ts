import JSBI from 'jsbi';
import { TokenInfo } from '../../../../hooks/Token';
import { encodeSqrtRatioX96 } from './encodeSqrtRatioX96';
import { TickMath } from './tickMath';
import { priceToClosestTick } from './getTickToPrice';
import { sortsBefore } from '../../../../utils/address';
import { nearestUsableTick } from './nearestUsableTick';
import { Price } from '../../../../utils/fractions';

export function tryParsePrice(
  baseToken?: TokenInfo,
  quoteToken?: TokenInfo,
  value?: string,
) {
  if (!baseToken || !quoteToken || !value) {
    return undefined;
  }

  if (!value.match(/^\d*\.?\d+$/)) {
    return undefined;
  }

  const [whole, fraction] = value.split('.');

  const decimals = fraction?.length ?? 0;
  const withoutDecimals = JSBI.BigInt((whole ?? '') + (fraction ?? ''));

  return new Price(
    baseToken,
    quoteToken,
    JSBI.multiply(
      JSBI.BigInt(10 ** decimals),
      JSBI.BigInt(10 ** baseToken.decimals),
    ),
    JSBI.multiply(withoutDecimals, JSBI.BigInt(10 ** quoteToken.decimals)),
  );
}

export function tryParseTick(
  baseToken?: TokenInfo,
  quoteToken?: TokenInfo,
  value?: string,
  tickSpacing?: number,
): number | undefined {
  if (!baseToken || !quoteToken || !value || tickSpacing === undefined) {
    return undefined;
  }

  const price = tryParsePrice(baseToken, quoteToken, value);

  if (!price) {
    return undefined;
  }

  let tick: number;

  // check price is within min/max bounds, if outside return min/max
  const sqrtRatioX96 = encodeSqrtRatioX96(price.numerator, price.denominator);

  if (JSBI.greaterThanOrEqual(sqrtRatioX96, TickMath.MAX_SQRT_RATIO)) {
    tick = TickMath.MAX_TICK;
  } else if (JSBI.lessThanOrEqual(sqrtRatioX96, TickMath.MIN_SQRT_RATIO)) {
    tick = TickMath.MIN_TICK;
  } else {
    // this function is agnostic to the base, will always return the correct tick
    tick = priceToClosestTick(price);
  }

  return nearestUsableTick(tick, tickSpacing);
}
