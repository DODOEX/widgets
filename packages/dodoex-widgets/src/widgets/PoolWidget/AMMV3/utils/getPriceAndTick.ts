import { SqrtPriceMath, TickMath } from '@raydium-io/raydium-sdk-v2';
import BigNumber from 'bignumber.js';
import Decimal from 'decimal.js';
import { FeeAmount, TICK_SPACINGS } from '../sdks/v3-sdk/constants';

/**
 * @see @raydium-io/raydium-sdk-v2 TickUtils.getPriceAndTick
 * @param param0
 * @returns
 */
export function getPriceAndTick({
  price,
  feeAmount,
  mintDecimalsA,
  mintDecimalsB,
  baseIn,
}: {
  price: BigNumber;
  feeAmount: FeeAmount;
  mintDecimalsA: number;
  mintDecimalsB: number;
  baseIn: boolean;
}): {
  tick: number;
  price: Decimal;
} {
  const priceD = new Decimal(price.toString());
  const _price = baseIn ? priceD : new Decimal(1).div(priceD);

  const tick = TickMath.getTickWithPriceAndTickspacing(
    _price,
    TICK_SPACINGS[feeAmount],
    mintDecimalsA,
    mintDecimalsB,
  );
  const tickSqrtPriceX64 = SqrtPriceMath.getSqrtPriceX64FromTick(tick);
  const tickPrice = SqrtPriceMath.sqrtPriceX64ToPrice(
    tickSqrtPriceX64,
    mintDecimalsA,
    mintDecimalsB,
  );

  return baseIn
    ? { tick, price: tickPrice }
    : { tick, price: new Decimal(1).div(tickPrice) };
}
