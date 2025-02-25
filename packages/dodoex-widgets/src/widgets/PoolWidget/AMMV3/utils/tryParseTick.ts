import {
  MAX_SQRT_PRICE_X64,
  MAX_TICK,
  MIN_SQRT_PRICE_X64,
  MIN_TICK,
  SqrtPriceMath,
} from '@raydium-io/raydium-sdk-v2';
import Decimal from 'decimal.js';
import { FeeAmount, TICK_SPACINGS, nearestUsableTick } from '../sdks/v3-sdk';

export function tryParseTick({
  decimalsA,
  decimalsB,
  value,
  feeAmount,
}: {
  decimalsA: number | undefined;
  decimalsB: number | undefined;
  value: string | undefined;
  feeAmount: FeeAmount | undefined;
}): number | undefined {
  if (!value || !decimalsA || !decimalsB || !feeAmount) {
    return undefined;
  }

  let tick: number;
  const price = new Decimal(value);
  if (!price.isFinite()) {
    return undefined;
  }

  const sqrtPriceX64 = SqrtPriceMath.priceToSqrtPriceX64(
    price,
    decimalsA,
    decimalsB,
  );

  if (sqrtPriceX64.gt(MAX_SQRT_PRICE_X64)) {
    tick = MAX_TICK;
  } else if (sqrtPriceX64.lt(MIN_SQRT_PRICE_X64)) {
    tick = MIN_TICK;
  } else {
    // this function is agnostic to the base, will always return the correct tick
    tick = SqrtPriceMath.getTickFromSqrtPriceX64(sqrtPriceX64);
  }

  return nearestUsableTick(tick, TICK_SPACINGS[feeAmount]);
}
