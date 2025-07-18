import {
  ChainId,
  Curve_Stableswap_Ng_GetPoolInfoQuery,
  CurveApi,
} from '@dodoex/api';
import { useQuery } from '@tanstack/react-query';
import { useGraphQLRequests } from '../../../../hooks/useGraphQLRequests';
import { useCallback } from 'react';
import { CurvePoolT } from '../types';

export function usePoolDetail({
  address,
  chainId,
}: {
  address: string | undefined;
  chainId: ChainId | undefined;
}) {
  const graphQLRequests = useGraphQLRequests();

  const convertToCurvePoolT = useCallback(
    (data: Curve_Stableswap_Ng_GetPoolInfoQuery): CurvePoolT | undefined => {
      const pool = data?.curve_stableswap_ng_getPoolInfo;
      if (!pool) {
        return undefined;
      }
      const coins =
        pool.coins?.map((coin) => ({
          chainId: chainId ?? ChainId.ZETACHAIN,
          address: coin.address || coin.id || '',
          name: coin.name || coin.symbol || '',
          decimals: coin.decimals || 18,
          symbol: coin.symbol || '',
          logoURI: coin.logoImg || undefined,
        })) || [];
      return {
        chainId: chainId ?? ChainId.ZETACHAIN,
        name: pool.name || '',
        address: pool.address || pool.id || '',
        symbol: coins.length > 0 ? coins.map((c) => c.symbol).join('.') : '',
        decimals: 18, // LP token decimals
        fee: pool.fee?.toString() || '0',
        coins,
        apy: pool.apy?.toString() || null,
        dailyApy: null,
        weeklyApy: null,
        tvl: pool.tvl?.toString() || null,
        volume: pool.volume?.toString() || null,
        dailyVolumeUsd: pool.dailyVolumeUsd?.toString() || null,
        traderCount: pool.traderCount?.toString() || null,
        lpTokenBalance: null,
        liquidityUtilization: pool.liquidityUtilization?.toString() || null,
        daoFee: pool.daoFee?.toString() || null,
        virtualPrice: pool.virtualPrice?.toString() || null,
        poolType: (pool.poolType as 'plain' | 'meta') || 'plain',
        a: pool.a?.toString() || null,
        offpegFeeMultiplier: pool.offpegFeeMultiplier?.toString() || null,
      };
    },
    [chainId],
  );

  const { data, isLoading, error } = useQuery({
    ...graphQLRequests.getQuery(
      CurveApi.graphql.curve_stableswap_ng_getPoolInfo,
      {
        where: {
          chainId: chainId ?? ChainId.ZETACHAIN,
          poolAddress: address ?? '',
        },
      },
    ),
    enabled: !!address && !!chainId,
    select: convertToCurvePoolT,
  });

  return {
    poolDetail: data,
    isLoading,
    error,
  };
}
