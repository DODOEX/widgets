import JSBI from 'jsbi';
import { SqrtPriceMath } from './sqrtPriceMath';
import { TickMath } from './tickMath';
import { getLiquidityByAmounts } from './maxLiquidityForAmounts';
import { BigintIsh, MaxUint256, ZERO } from './constants';

export function getPositionAmount0({
  tickCurrent,
  tickLower,
  tickUpper,
  liquidity,
  roundUp,
}: {
  tickCurrent: number;
  tickLower: number;
  tickUpper: number;
  liquidity: number | bigint | JSBI | string;
  roundUp?: boolean;
}) {
  const liquidityJsbi = JSBI.BigInt(liquidity.toString());
  if (tickCurrent < tickLower) {
    const amount = SqrtPriceMath.getAmount0Delta(
      TickMath.getSqrtRatioAtTick(tickLower),
      TickMath.getSqrtRatioAtTick(tickUpper),
      liquidityJsbi,
      !!roundUp,
    );
    return amount;
  } else if (tickCurrent < tickUpper) {
    const sqrtRatioX96 = TickMath.getSqrtRatioAtTick(tickCurrent);
    const amount = SqrtPriceMath.getAmount0Delta(
      sqrtRatioX96,
      TickMath.getSqrtRatioAtTick(tickUpper),
      liquidityJsbi,
      !!roundUp,
    );
    return amount;
  } else {
    return ZERO;
  }
}

export function getPositionAmount1({
  tickCurrent,
  tickLower,
  tickUpper,
  liquidity,
  roundUp,
}: {
  tickCurrent: number;
  tickLower: number;
  tickUpper: number;
  liquidity: number | bigint | JSBI | string;
  roundUp?: boolean;
}) {
  const liquidityJsbi = JSBI.BigInt(liquidity.toString());
  if (tickCurrent < tickLower) {
    return ZERO;
  } else if (tickCurrent < tickUpper) {
    const sqrtRatioX96 = TickMath.getSqrtRatioAtTick(tickCurrent);
    const amount = SqrtPriceMath.getAmount1Delta(
      TickMath.getSqrtRatioAtTick(tickLower),
      sqrtRatioX96,
      liquidityJsbi,
      !!roundUp,
    );
    return amount;
  } else {
    const amount = SqrtPriceMath.getAmount1Delta(
      TickMath.getSqrtRatioAtTick(tickLower),
      TickMath.getSqrtRatioAtTick(tickUpper),
      liquidityJsbi,
      !!roundUp,
    );
    return amount;
  }
}

export function getPositionAmountFromAmount0({
  sqrtRatioX96,
  tickCurrent,
  tickLower,
  tickUpper,
  amount0,
  useFullPrecision,
}: {
  sqrtRatioX96: JSBI;
  tickCurrent: number;
  tickLower: number;
  tickUpper: number;
  amount0: BigintIsh;
  useFullPrecision: boolean;
}) {
  const liquidity = getLiquidityByAmounts({
    sqrtRatioX96,
    tickLower,
    tickUpper,
    amount0,
    amount1: MaxUint256,
    useFullPrecision,
  });

  return {
    amount0: getPositionAmount0({
      tickCurrent,
      tickLower,
      tickUpper,
      liquidity,
    }),
    amount1: getPositionAmount1({
      tickCurrent,
      tickLower,
      tickUpper,
      liquidity,
    }),
  };
}

export function getPositionAmountFromAmount1({
  sqrtRatioX96,
  tickCurrent,
  tickLower,
  tickUpper,
  amount1,
}: {
  sqrtRatioX96: JSBI;
  tickCurrent: number;
  tickLower: number;
  tickUpper: number;
  amount1: BigintIsh;
}) {
  // this function always uses full precision,
  const liquidity = getLiquidityByAmounts({
    sqrtRatioX96,
    tickLower,
    tickUpper,
    amount0: MaxUint256,
    amount1,
    useFullPrecision: true,
  });

  return {
    amount0: getPositionAmount0({
      tickCurrent,
      tickLower,
      tickUpper,
      liquidity,
    }),
    amount1: getPositionAmount1({
      tickCurrent,
      tickLower,
      tickUpper,
      liquidity,
    }),
  };
}
