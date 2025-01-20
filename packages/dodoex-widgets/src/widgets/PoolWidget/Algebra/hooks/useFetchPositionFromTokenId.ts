import { getFetchNonfungiblePositionManagerAlgebraPositionsQueryOptions } from '@dodoex/dodo-contract-request';
import { useQuery } from '@tanstack/react-query';
import React from 'react';
import {
  ALGEBRA_POOL_DEPLOYER_ADDRESSES,
  ALGEBRA_POOL_INIT_CODE_HASH,
  computePoolAddressByAddress,
} from '../../../../utils/address';
import { ChainId } from '@dodoex/api';

export function useFetchPositionFromTokenId({
  chainId,
  tokenId,
}: {
  chainId: number | undefined;
  tokenId: string | undefined;
}) {
  const fetchPosition = useQuery(
    getFetchNonfungiblePositionManagerAlgebraPositionsQueryOptions(
      chainId,
      tokenId ? Number(tokenId) : undefined,
    ),
  );

  const position = React.useMemo(() => {
    if (!fetchPosition.data) return fetchPosition.data;
    return {
      tokenId,
      pool: computePoolAddressByAddress({
        tokenA: fetchPosition.data.token0,
        tokenB: fetchPosition.data.token1,
        poolDeployer: ALGEBRA_POOL_DEPLOYER_ADDRESSES[chainId as ChainId] ?? '',
        initCodeHashManualOverride:
          ALGEBRA_POOL_INIT_CODE_HASH[chainId as ChainId] ?? '',
      }),
      feeGrowthInside0LastX128: fetchPosition.data.feeGrowthInside0LastX128,
      feeGrowthInside1LastX128: fetchPosition.data.feeGrowthInside1LastX128,
      liquidity: fetchPosition.data.liquidity,
      nonce: fetchPosition.data.nonce,
      operator: fetchPosition.data.operator,
      tickLower: Number(fetchPosition.data.tickLower),
      tickUpper: Number(fetchPosition.data.tickUpper),
      token0: fetchPosition.data.token0,
      token1: fetchPosition.data.token1,
      tokensOwed0: fetchPosition.data.tokensOwed0,
      tokensOwed1: fetchPosition.data.tokensOwed1,
    };
  }, [fetchPosition.data, tokenId, chainId]);

  return {
    ...fetchPosition,
    position,
  };
}
