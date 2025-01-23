import JSBI from 'jsbi';
import { TickMath } from './tickMath';
import { encodeSqrtRatioX96 } from './encodeSqrtRatioX96';
import { getPositionAmount0, getPositionAmount1 } from './getPositionAmount';
import { getLiquidityByAmounts } from './maxLiquidityForAmounts';
import { tickToPrice } from './getTickToPrice';
import { Percent, Price } from '../../../../utils/fractions';
import { TokenInfo } from '../../../../hooks/Token';
import { sortsBefore } from '../../../../utils';

/**
 * Returns the lower and upper sqrt ratios if the price 'slips' up to slippage tolerance percentage
 * @param slippageTolerance The amount by which the price can 'slip' before the transaction will revert
 * @returns The sqrt ratios after slippage
 */
function ratiosAfterSlippage(
  price: Price,
  slippageTolerance: Percent,
): {
  sqrtRatioX96Lower: JSBI;
  sqrtRatioX96Upper: JSBI;
} {
  const token0Price = sortsBefore(price.baseCurrency, price.quoteCurrency)
    ? price
    : price.invert();
  const priceLower = token0Price.asFraction.multiply(
    new Percent(1).subtract(slippageTolerance),
  );
  const priceUpper = token0Price.asFraction.multiply(slippageTolerance.add(1));
  let sqrtRatioX96Lower = encodeSqrtRatioX96(
    priceLower.numerator,
    priceLower.denominator,
  );
  if (JSBI.lessThanOrEqual(sqrtRatioX96Lower, TickMath.MIN_SQRT_RATIO)) {
    sqrtRatioX96Lower = JSBI.add(TickMath.MIN_SQRT_RATIO, JSBI.BigInt(1));
  }
  let sqrtRatioX96Upper = encodeSqrtRatioX96(
    priceUpper.numerator,
    priceUpper.denominator,
  );
  if (JSBI.greaterThanOrEqual(sqrtRatioX96Upper, TickMath.MAX_SQRT_RATIO)) {
    sqrtRatioX96Upper = JSBI.subtract(TickMath.MAX_SQRT_RATIO, JSBI.BigInt(1));
  }
  return {
    sqrtRatioX96Lower,
    sqrtRatioX96Upper,
  };
}

/**
 * Returns the minimum amounts that must be sent in order to safely mint the amount of liquidity held by the position
 * with the given slippage tolerance
 * @param slippageTolerance Tolerance of unfavorable slippage from the current price
 * @returns The amounts, with slippage
 */
export function mintAmountsWithSlippage(
  tickCurrent: number,
  slippageTolerance: Percent,
  tickLower: number,
  tickUpper: number,
  baseToken: TokenInfo,
  quoteToken: TokenInfo,
  amount0: string,
  amount1: string,
) {
  const sqrtRatioX96 = TickMath.getSqrtRatioAtTick(Number(tickCurrent));
  const price = tickToPrice(baseToken, quoteToken, tickCurrent);
  // get lower/upper prices
  const { sqrtRatioX96Upper, sqrtRatioX96Lower } = ratiosAfterSlippage(
    price,
    slippageTolerance,
  );

  const liquidity = getLiquidityByAmounts({
    sqrtRatioX96,
    tickLower,
    tickUpper,
    amount0,
    amount1,
    useFullPrecision: false,
  });
  const minAmount0 = getPositionAmount0({
    tickCurrent: TickMath.getTickAtSqrtRatio(sqrtRatioX96Upper),
    tickLower,
    tickUpper,
    liquidity,
    roundUp: true,
  });
  const minAmount1 = getPositionAmount1({
    tickCurrent: TickMath.getTickAtSqrtRatio(sqrtRatioX96Lower),
    tickLower,
    tickUpper,
    liquidity,
    roundUp: true,
  });

  return { amount0: minAmount0, amount1: minAmount1 };
}

/**
 * Returns the minimum amounts that should be requested in order to safely burn the amount of liquidity held by the
 * position with the given slippage tolerance
 * @param slippageTolerance tolerance of unfavorable slippage from the current price
 * @returns The amounts, with slippage
 */
export function burnAmountsWithSlippage(
  tickCurrent: number,
  slippageTolerance: Percent,
  tickLower: number,
  tickUpper: number,
  liquidity: number | bigint | JSBI | string,
  baseToken: TokenInfo,
  quoteToken: TokenInfo,
): Readonly<{ amount0: JSBI; amount1: JSBI }> {
  const price = tickToPrice(baseToken, quoteToken, tickCurrent);
  // get lower/upper prices
  const { sqrtRatioX96Upper, sqrtRatioX96Lower } = ratiosAfterSlippage(
    price,
    slippageTolerance,
  );

  const minAmount0 = getPositionAmount0({
    tickCurrent: TickMath.getTickAtSqrtRatio(sqrtRatioX96Upper),
    tickLower,
    tickUpper,
    liquidity,
    roundUp: false,
  });
  const minAmount1 = getPositionAmount1({
    tickCurrent: TickMath.getTickAtSqrtRatio(sqrtRatioX96Lower),
    tickLower,
    tickUpper,
    liquidity,
    roundUp: false,
  });

  return { amount0: minAmount0, amount1: minAmount1 };
}
