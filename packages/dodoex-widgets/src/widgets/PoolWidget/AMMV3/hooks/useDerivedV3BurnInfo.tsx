import { t } from '@lingui/macro';
import { ReactNode, useMemo } from 'react';
import { useWalletInfo } from '../../../../hooks/ConnectWallet/useWalletInfo';
import { Currency, CurrencyAmount, Percent } from '../sdks/sdk-core';
import { Position } from '../sdks/v3-sdk';
import { PositionDetails } from '../types/position';
import { usePool } from './usePool';

export function useDerivedV3BurnInfo({
  percent,
  position,
  asWETH,
  baseToken,
  quoteToken,
}: {
  percent: number;
  position?: PositionDetails;
  asWETH?: boolean;
  baseToken: Maybe<Currency>;
  quoteToken: Maybe<Currency>;
}): {
  position?: Position;
  liquidityPercentage?: Percent;
  liquidityValue0?: CurrencyAmount<Currency>;
  liquidityValue1?: CurrencyAmount<Currency>;
  feeValue0?: CurrencyAmount<Currency>;
  feeValue1?: CurrencyAmount<Currency>;
  outOfRange: boolean;
  error?: ReactNode;
} {
  const { account, chainId } = useWalletInfo();

  const [tokenA, tokenB] = useMemo(
    () => [baseToken?.wrapped, quoteToken?.wrapped],
    [baseToken, quoteToken],
  );

  const [token0, token1] = useMemo(
    () =>
      tokenA && tokenB
        ? tokenA.sortsBefore(tokenB)
          ? [tokenA, tokenB]
          : [tokenB, tokenA]
        : [undefined, undefined],
    [tokenA, tokenB],
  );

  const [, pool] = usePool(
    token0 ?? undefined,
    token1 ?? undefined,
    position?.fee,
  );

  const positionSDK = useMemo(
    () =>
      pool &&
      position?.liquidity &&
      typeof position?.tickLower === 'number' &&
      typeof position?.tickUpper === 'number'
        ? new Position({
            pool,
            liquidity: position.liquidity.toString(),
            tickLower: position.tickLower,
            tickUpper: position.tickUpper,
          })
        : undefined,
    [pool, position],
  );

  const liquidityPercentage = new Percent(percent, 100);

  const discountedAmount0 = positionSDK
    ? liquidityPercentage.multiply(positionSDK.amount0.quotient).quotient
    : undefined;
  const discountedAmount1 = positionSDK
    ? liquidityPercentage.multiply(positionSDK.amount1.quotient).quotient
    : undefined;

  const liquidityValue0 =
    token0 && discountedAmount0
      ? CurrencyAmount.fromRawAmount(token0, discountedAmount0)
      : undefined;
  const liquidityValue1 =
    token1 && discountedAmount1
      ? CurrencyAmount.fromRawAmount(token1, discountedAmount1)
      : undefined;

  const outOfRange =
    pool && position
      ? pool.tickCurrent < position.tickLower ||
        pool.tickCurrent > position.tickUpper
      : false;

  let error: ReactNode | undefined;
  if (!account) {
    error = t`Connect to a wallet`;
  }
  if (percent === 0) {
    error = error ?? t`Enter a percent`;
  }
  return {
    position: positionSDK,
    liquidityPercentage,
    liquidityValue0,
    liquidityValue1,
    feeValue0: undefined,
    feeValue1: undefined,
    outOfRange,
    error,
  };
}
