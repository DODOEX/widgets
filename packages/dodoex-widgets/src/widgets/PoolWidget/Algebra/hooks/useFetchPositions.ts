import {
  getFetchNonfungiblePositionManagerAlgebraBalanceOfQueryOptions,
  getFetchNonfungiblePositionManagerAlgebraPositionsQueryOptions,
  getFetchNonfungiblePositionManagerAlgebraTokenOfOwnerByIndexQueryOptions,
} from '@dodoex/dodo-contract-request';
import { useQueries, useQuery } from '@tanstack/react-query';
import React from 'react';
import { increaseArray } from '../../../../utils/utils';
import {
  ALGEBRA_POOL_DEPLOYER_ADDRESSES,
  ALGEBRA_POOL_INIT_CODE_HASH,
  computePoolAddressByAddress,
} from '../../../../utils/address';
import { ChainId } from '@dodoex/api';

export function useFetchPositions({
  account,
  chainId,
}: {
  account?: string;
  chainId?: number;
}) {
  const fetchBalance = useQuery(
    getFetchNonfungiblePositionManagerAlgebraBalanceOfQueryOptions(
      chainId,
      account,
    ),
  );

  const fetchTokenIds = useQueries({
    queries: (fetchBalance.data
      ? increaseArray(Number(fetchBalance.data))
      : []
    ).map((_, i) => {
      return getFetchNonfungiblePositionManagerAlgebraTokenOfOwnerByIndexQueryOptions(
        chainId,
        account,
        i,
      );
    }),
  });

  const fetchPositions = useQueries({
    queries: fetchTokenIds
      .filter((item) => !!item.data)
      .map((item) => {
        return getFetchNonfungiblePositionManagerAlgebraPositionsQueryOptions(
          chainId,
          Number(item.data),
        );
      }),
  });

  const positions = React.useMemo(() => {
    return fetchPositions
      .map((item, i) => {
        if (!item.data) return null;
        const tokenId = Number(fetchTokenIds[i].data) as number;
        return {
          tokenId,
          pool: computePoolAddressByAddress({
            tokenA: item.data.token0,
            tokenB: item.data.token1,
            poolDeployer:
              ALGEBRA_POOL_DEPLOYER_ADDRESSES[chainId as ChainId] ?? '',
            initCodeHashManualOverride:
              ALGEBRA_POOL_INIT_CODE_HASH[chainId as ChainId] ?? '',
          }),
          feeGrowthInside0LastX128: item.data.feeGrowthInside0LastX128,
          feeGrowthInside1LastX128: item.data.feeGrowthInside1LastX128,
          liquidity: item.data.liquidity,
          nonce: item.data.nonce,
          operator: item.data.operator,
          tickLower: item.data.tickLower,
          tickUpper: item.data.tickUpper,
          token0: item.data.token0,
          token1: item.data.token1,
          tokensOwed0: item.data.tokensOwed0,
          tokensOwed1: item.data.tokensOwed1,
        };
      })
      .filter((item) => !!item);
  }, [fetchPositions, fetchTokenIds, chainId]);

  const isError =
    fetchBalance.isError ||
    fetchTokenIds.some((item) => item.isError) ||
    fetchPositions.some((item) => item.isError);
  const isLoading =
    fetchBalance.isLoading ||
    fetchTokenIds.some((item) => item.isLoading) ||
    fetchPositions.some((item) => item.isLoading);

  const refetchError = () => {
    if (fetchBalance.isError) {
      fetchBalance.refetch();
    }
    fetchTokenIds.find((item) => item.isError)?.refetch?.();
    fetchPositions.find((item) => item.isError)?.refetch?.();
  };

  return {
    isError,
    isLoading,
    refetchError,
    positions,
  };
}
