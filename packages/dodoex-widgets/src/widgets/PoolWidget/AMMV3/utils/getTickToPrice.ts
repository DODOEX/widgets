import { SqrtPriceMath } from '@raydium-io/raydium-sdk-v2';
import BigNumber from 'bignumber.js';

export function getTickToPrice({
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
  const sqrtPriceX64 = SqrtPriceMath.getSqrtPriceX64FromTick(tick);
  return new BigNumber(
    SqrtPriceMath.sqrtPriceX64ToPrice(
      sqrtPriceX64,
      decimalsA,
      decimalsB,
    ).toString(),
  );
}
