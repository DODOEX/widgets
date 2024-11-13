import { useQuery } from '@tanstack/react-query';
import { uniPoolV2Api } from '../utils';
import { useWalletInfo } from '../../../hooks/ConnectWallet/useWalletInfo';
import { CurrencyAmount, Percent } from '@uniswap/sdk-core';
import React from 'react';
import { Pair } from '@uniswap/v2-sdk';
import BigNumber from 'bignumber.js';
import { byWei } from '../../../utils';

export function useAMMV2Balance({
  pairAddress,
  pair,
}: {
  pairAddress?: string;
  pair?: Pair | null;
}) {
  const { account } = useWalletInfo();
  const chainId = pair?.liquidityToken?.chainId;
  const balanceQuery = useQuery({
    ...uniPoolV2Api.getBalance(chainId, pairAddress, account),
    retry: false,
  });
  const totalSupplyQuery = useQuery({
    ...uniPoolV2Api.getTotalSupply(chainId, pairAddress),
    retry: false,
  });

  const [poolTokenPercentage, token0Deposited, token1Deposited] =
    React.useMemo(() => {
      if (
        !pair ||
        !balanceQuery.data ||
        !totalSupplyQuery.data ||
        !totalSupplyQuery.data.gte(balanceQuery.data)
      ) {
        return [undefined, undefined, undefined];
      }
      const totalPoolTokens = CurrencyAmount.fromRawAmount(
        pair.liquidityToken,
        totalSupplyQuery.data.toString(),
      );
      const userPoolBalance = CurrencyAmount.fromRawAmount(
        pair.liquidityToken,
        balanceQuery.data.toString(),
      );
      const poolTokenPercentage = new Percent(
        balanceQuery.data.toString(),
        totalSupplyQuery.data.toString(),
      );
      return [
        poolTokenPercentage,
        pair.getLiquidityValue(
          pair.token0,
          totalPoolTokens,
          userPoolBalance,
          false,
        ),
        pair.getLiquidityValue(
          pair.token1,
          totalPoolTokens,
          userPoolBalance,
          false,
        ),
      ];
    }, [balanceQuery.data, totalSupplyQuery.data, pair]);

  return {
    isBalanceLoading: balanceQuery.isLoading,
    isDepositedLoading: balanceQuery.isLoading || totalSupplyQuery.isLoading,
    balance:
      balanceQuery.data && pair
        ? byWei(balanceQuery.data.toString(), pair.liquidityToken.decimals)
        : undefined,
    poolTokenPercentage: poolTokenPercentage
      ? new BigNumber(poolTokenPercentage.toSignificant(6))
      : undefined,
    token0Deposited: token0Deposited
      ? new BigNumber(token0Deposited.toSignificant())
      : undefined,
    token1Deposited: token1Deposited
      ? new BigNumber(token1Deposited.toSignificant())
      : undefined,
  };
}
