import { useQuery } from '@tanstack/react-query';
import BigNumber from 'bignumber.js';
import { useMemo } from 'react';
import { CurvePoolT } from '../types';
import { curveApi } from '../utils';

export function useLpTokenBalances({
  pool,
  account,
}: {
  pool: CurvePoolT | undefined;
  account: string | undefined;
}) {
  const balanceOfResult = useQuery(
    curveApi.getBalanceOf(pool?.chainId, pool?.address, account),
  );

  const balancesResult = useQuery(
    curveApi.getBalances(pool?.chainId, pool?.address, pool?.coins ?? []),
  );

  const totalSupplyResult = useQuery(
    curveApi.getTotalSupply(pool?.chainId, pool?.address),
  );

  const lpTokenTotalSupply = useMemo(() => {
    if (!totalSupplyResult.data) {
      return null;
    }
    if (pool?.decimals == null) {
      return null;
    }
    return totalSupplyResult.data
      .div(10 ** pool.decimals)
      .dp(pool.decimals, BigNumber.ROUND_DOWN);
  }, [totalSupplyResult.data, pool?.decimals]);

  const lpTokenBalance = useMemo(() => {
    if (!balanceOfResult.data) {
      return null;
    }
    if (pool?.decimals == null) {
      return null;
    }
    return balanceOfResult.data
      .div(10 ** pool.decimals)
      .dp(pool.decimals, BigNumber.ROUND_DOWN);
  }, [balanceOfResult.data, pool?.decimals]);

  const tokenBalances = useMemo(() => {
    if (!balancesResult.data) {
      return null;
    }
    if (pool?.coins == null) {
      return null;
    }
    return balancesResult.data.map((balance, index) => {
      const coin = pool.coins[index];
      return balance
        .div(10 ** coin.decimals)
        .dp(coin.decimals, BigNumber.ROUND_DOWN);
    });
  }, [balancesResult.data, pool?.coins]);

  /**
   * 参考 CurveStableSwapNG.vy 的 remove_liquidity 函数
   */
  const userTokenBalances = useMemo(() => {
    if (!tokenBalances || !lpTokenBalance || !lpTokenTotalSupply) {
      return null;
    }
    if (pool?.coins == null) {
      return null;
    }
    return tokenBalances.map((balance, index) => {
      const coin = pool.coins[index];
      return balance
        .multipliedBy(lpTokenBalance)
        .div(lpTokenTotalSupply)
        .dp(coin.decimals, BigNumber.ROUND_DOWN);
    });
  }, [tokenBalances, lpTokenBalance, lpTokenTotalSupply, pool?.coins]);

  return {
    lpTokenTotalSupply,
    tokenBalances,
    lpTokenBalance,
    userTokenBalances,

    lpTokenBalanceLoading:
      balanceOfResult.isLoading ||
      balancesResult.isLoading ||
      totalSupplyResult.isLoading,
  };
}
