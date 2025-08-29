import {
  getFetchVE33V2PairBalanceOfQueryOptions,
  getFetchVE33V2PairGetReservesQueryOptions,
  getFetchVE33V2PairTotalSupplyQueryOptions,
} from '@dodoex/dodo-contract-request';
import { useQuery } from '@tanstack/react-query';
import { getLpToTokenBalance } from '../../../PoolWidget/hooks/usePoolBalanceInfo';
import { formatUnits } from '@dodoex/contract-request';
import BigNumber from 'bignumber.js';
import { CurrencyAmount, Price, sqrt, Token } from '@uniswap/sdk-core';
import { TokenInfo } from '../../../../hooks/Token';
import { byWei, formatReadableNumber, sortsBefore } from '../../../../utils';
import React from 'react';
import JSBI from 'jsbi';
import { MINIMUM_LIQUIDITY } from '@uniswap/v2-sdk';

export function useVe33V2BalanceInfo({
  account,
  pool,
}: {
  account?: string;
  pool?: {
    id: string;
    chainId: number;
    baseToken: TokenInfo;
    quoteToken: TokenInfo;
  };
}) {
  const isRearTokenA = pool
    ? sortsBefore(pool?.quoteToken, pool?.baseToken)
    : false;
  const token0 = isRearTokenA ? pool?.quoteToken : pool?.baseToken;
  const token1 = isRearTokenA ? pool?.baseToken : pool?.quoteToken;
  const token0Decimals = token0?.decimals;
  const token1Decimals = token1?.decimals;

  const userLpQuery = useQuery(
    getFetchVE33V2PairBalanceOfQueryOptions(pool?.chainId, pool?.id, account),
  );
  const totalLpQuery = useQuery(
    getFetchVE33V2PairTotalSupplyQueryOptions(pool?.chainId, pool?.id),
  );
  const reserveQuery = useQuery(
    getFetchVE33V2PairGetReservesQueryOptions(pool?.chainId, pool?.id),
  );

  const lpDecimals = 18;
  const userLp = userLpQuery.data
    ? new BigNumber(formatUnits(userLpQuery.data, lpDecimals))
    : undefined;
  const totalLp = totalLpQuery.data
    ? new BigNumber(formatUnits(totalLpQuery.data, lpDecimals))
    : undefined;
  const token0Reserve =
    reserveQuery.data && token0Decimals !== undefined
      ? new BigNumber(formatUnits(reserveQuery.data._reserve0, token0Decimals))
      : undefined;
  const token1Reserve =
    reserveQuery.data && token1Decimals !== undefined
      ? new BigNumber(formatUnits(reserveQuery.data._reserve1, token1Decimals))
      : undefined;

  const [baseLpToTokenProportion, userLpToToken0] = getLpToTokenBalance(
    userLp,
    totalLp,
    token0Reserve,
    undefined,
    pool?.id,
    undefined,
    lpDecimals,
  );
  const [quoteLpToTokenProportion, userLpToToken1] = getLpToTokenBalance(
    userLp,
    totalLp,
    token1Reserve,
    undefined,
    pool?.id,
    undefined,
    lpDecimals,
  );

  const userLpToTokenBalanceLoading =
    userLpQuery.isLoading || totalLpQuery.isLoading || reserveQuery.isLoading;
  const userLpToTokenBalanceIsError =
    userLpQuery.isError || totalLpQuery.isError || reserveQuery.isError;
  const userLpToTokenBalanceErrorRefetch = userLpToTokenBalanceIsError
    ? () => {
        if (userLpQuery.isError) {
          userLpQuery.refetch();
        }
        if (totalLpQuery.isError) {
          totalLpQuery.refetch();
        }
        if (reserveQuery.isError) {
          reserveQuery.refetch();
        }
      }
    : undefined;

  const [price, liquidityMinted, poolTokenPercentage] = React.useMemo(() => {
    if (
      !token0 ||
      !token1 ||
      !reserveQuery.data?._reserve0 ||
      !reserveQuery.data._reserve1
    )
      return [undefined, undefined, undefined];
    const currency0Amount = CurrencyAmount.fromRawAmount(
      new Token(
        token0.chainId,
        token0.address,
        token0.decimals,
        token0.symbol,
        token0.name,
      ),
      reserveQuery.data?._reserve0?.toString(),
    );
    const currency1Amount = CurrencyAmount.fromRawAmount(
      new Token(
        token1.chainId,
        token1.address,
        token1.decimals,
        token1.symbol,
        token1.name,
      ),
      reserveQuery.data?._reserve1?.toString(),
    );
    const value = currency1Amount.divide(currency0Amount);
    const price = new Price(
      currency0Amount.currency,
      currency1Amount.currency,
      value.denominator,
      value.numerator,
    );

    let liquidity: JSBI;
    if (totalLpQuery.data === undefined) return [price, undefined, undefined];
    const totalSupply = JSBI.BigInt(totalLpQuery.data.toString());
    if (!totalLpQuery.data) {
      liquidity = JSBI.subtract(
        sqrt(JSBI.multiply(currency0Amount.quotient, currency1Amount.quotient)),
        MINIMUM_LIQUIDITY,
      );
    } else {
      const amount0 = JSBI.divide(
        JSBI.multiply(currency0Amount.quotient, totalSupply),
        JSBI.BigInt(reserveQuery.data._reserve0.toString()),
      );
      const amount1 = JSBI.divide(
        JSBI.multiply(currency1Amount.quotient, totalSupply),
        JSBI.BigInt(reserveQuery.data._reserve1.toString()),
      );
      liquidity = JSBI.lessThanOrEqual(amount0, amount1) ? amount0 : amount1;
    }
    const liquidityBg = new BigNumber(liquidity.toString());
    const poolTokenPercentage = liquidityBg
      .div(JSBI.add(liquidity, totalSupply).toString())
      .times(100);
    const liquidityMinted = byWei(liquidityBg, lpDecimals);

    return [price, liquidityMinted, poolTokenPercentage];
  }, [token0, token1, reserveQuery.data, totalLpQuery.data, lpDecimals]);

  let shareOfPool = '-';
  if (pool?.baseToken && pool.quoteToken) {
    shareOfPool = poolTokenPercentage
      ? `${formatReadableNumber({
          input: poolTokenPercentage,
          showDecimals: 2,
          roundingMode: BigNumber.ROUND_HALF_UP,
        })}%`
      : '0%';
  }

  const refetch = () => {
    userLpQuery.refetch();
    totalLpQuery.refetch();
    reserveQuery.refetch();
  };

  return {
    userLpQuery,
    totalLpQuery,
    reserveQuery,

    baseLpToTokenProportion,
    quoteLpToTokenProportion,

    userLp,
    totalLp,
    token0Reserve,
    token1Reserve,
    userLpToToken0,
    userLpToToken1,
    isRearTokenA,
    price,
    liquidityMinted,
    poolTokenPercentage,
    shareOfPool,

    userLpToTokenBalanceLoading,
    userLpToTokenBalanceErrorRefetch,
    refetch,
  };
}
