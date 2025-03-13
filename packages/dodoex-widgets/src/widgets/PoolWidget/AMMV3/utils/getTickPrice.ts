import { SqrtPriceMath } from '@raydium-io/raydium-sdk-v2';
import BigNumber from 'bignumber.js';

/**
 * @see @raydium-io/raydium-sdk-v2 TickUtils.getTickPrice
 * @param param0
 * @returns
 */
export function getTickPrice({
  tick,
  decimalsA,
  decimalsB,
}: {
  tick?: number;
  decimalsA: number | undefined;
  decimalsB: number | undefined;
}): BigNumber | undefined {
  if (!decimalsA || !decimalsB || typeof tick !== 'number') {
    return undefined;
  }
  const tickSqrtPriceX64 = SqrtPriceMath.getSqrtPriceX64FromTick(tick);
  return new BigNumber(
    SqrtPriceMath.sqrtPriceX64ToPrice(
      tickSqrtPriceX64,
      decimalsA,
      decimalsB,
    ).toString(),
  );
}
