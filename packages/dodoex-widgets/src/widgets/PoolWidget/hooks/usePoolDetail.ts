import { ChainId, PoolApi, PoolType } from '@dodoex/api';
import { useQuery } from '@tanstack/react-query';
import BigNumber from 'bignumber.js';
import { graphQLRequests } from '../../../constants/api';
import { TokenInfo } from '../../../hooks/Token';
import { convertLiquidityTokenToTokenInfo } from '../utils';

export function usePoolDetail({
  id,
  chainId,
}: {
  id: string | undefined;
  chainId: ChainId | undefined;
}) {
  const chain = 'polygon';
  const query = graphQLRequests.getQuery(PoolApi.graphql.fetchPool, {
    id: id || '',
    where: {
      refreshNow: false,
      chain,
    },
    liquidityWhere: {
      chain,
      refreshNow: false,
      filterState: {
        address: id,
      },
    },
  });
  const fetchResult = useQuery({
    ...query,
    enabled: !!id,
  });

  const { pair } = fetchResult.data ?? {};

  return {
    ...fetchResult,
    poolDetail:
      pair && chainId
        ? {
            ...pair,
            address: pair.id,
            type: pair.type as PoolType,
            chainId,
            baseToken: convertLiquidityTokenToTokenInfo(
              pair.baseToken,
              chainId,
            ) as TokenInfo,
            quoteToken: convertLiquidityTokenToTokenInfo(
              pair.quoteToken,
              chainId,
            ) as TokenInfo,
          }
        : null,
  };
}
