import { ChainId, PoolApi, PoolType } from '@dodoex/api';
import { useQuery } from '@tanstack/react-query';
import BigNumber from 'bignumber.js';
import { TokenInfo } from '../../../hooks/Token';
import { formatApy } from '../../../utils';
import { convertLiquidityTokenToTokenInfo } from '../utils';
import { ThegraphKeyMap } from '../../../constants/chains';
import { useGraphQLRequests } from '../../../hooks/useGraphQLRequests';

export function usePoolDetail({
  id,
  chainId,
}: {
  id: string | undefined;
  chainId: ChainId | undefined;
}) {
  const chain = chainId ? ThegraphKeyMap[chainId] : '';
  const graphQLRequests = useGraphQLRequests();
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

  const { pair, liquidity_list } = fetchResult.data ?? {};
  const liquidityPair = liquidity_list?.lqList?.[0]?.pair;

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
            miningAddress: liquidityPair?.miningAddress?.[0] ?? '',
            apy: liquidityPair?.apy,
            baseApy: liquidityPair?.apy
              ? formatApy(
                  new BigNumber(liquidityPair.apy.transactionBaseApy ?? 0).plus(
                    liquidityPair.apy.miningBaseApy ?? 0,
                  ),
                )
              : undefined,
            quoteApy:
              Number(liquidityPair?.apy?.transactionQuoteApy) ||
              Number(liquidityPair?.apy?.miningQuoteApy)
                ? formatApy(
                    new BigNumber(
                      liquidityPair?.apy?.transactionQuoteApy ?? 0,
                    ).plus(liquidityPair?.apy?.miningQuoteApy ?? 0),
                  )
                : undefined,
            isCpPool: false,
            cpAddress: undefined as string | undefined,
            cpLiquidator: undefined as string | undefined,
            cpCreator: undefined as string | undefined,
            cpCreatedAtTimestamp: undefined as string | undefined,
          }
        : null,
  };
}
