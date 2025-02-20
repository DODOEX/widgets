import React, { useCallback } from 'react';
import { TokenInfo } from '../Token';
import { useFetchSolanaRoutePrice } from '../solana/useFetchSolanaRoutePrice';

export enum RoutePriceStatus {
  Initial = 'Initial',
  Loading = 'Loading',
  Failed = 'Failed',
  Success = 'Success',
}
export interface FetchRoutePrice {
  fromToken: TokenInfo | null;
  toToken: TokenInfo | null;
  fromAmount: string;
  slippage: number;
}

export function useFetchRoutePrice({
  toToken,
  fromToken,
  fromAmount,
  slippage,
}: FetchRoutePrice) {
  const {
    fetchRouteQuery: { isLoading, error, data: rawBrief },
    execute,
  } = useFetchSolanaRoutePrice({
    toToken,
    fromToken,
    fromAmount,
    slippage,
  });

  const status = React.useMemo(() => {
    if (isLoading) {
      return RoutePriceStatus.Loading;
    }
    if (error) {
      return RoutePriceStatus.Failed;
    }
    if (rawBrief) {
      return RoutePriceStatus.Success;
    }
    return RoutePriceStatus.Initial;
  }, [rawBrief, error, isLoading]);

  const executeSwap = useCallback(
    (subtitle: React.ReactNode) => {
      if (!rawBrief) {
        return;
      }
      return execute.mutate({
        rawBrief,
        subtitle,
      });
    },
    [rawBrief, execute],
  );

  return {
    status,
    rawBrief,
    executeSwap,
  };
}
