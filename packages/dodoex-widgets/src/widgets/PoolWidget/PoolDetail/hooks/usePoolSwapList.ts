import { ChainId, PoolApi } from '@dodoex/api';
import { useQuery } from '@tanstack/react-query';
import { ThegraphKeyMap } from '../../../../constants/chains';
import { useGlobalConfig } from '../../../../providers/GlobalConfigContext';

export function usePoolSwapList({
  chainId,
  address,
  first = 50,
}: {
  chainId: number | undefined;
  address: string | undefined;
  first?: number;
}) {
  const chain = chainId ? ThegraphKeyMap[chainId as ChainId] : '';
  const { graphQLRequests } = useGlobalConfig();
  const query = graphQLRequests.getQuery(PoolApi.graphql.fetchPoolSwapList, {
    first,
    orderBy: 'timestamp',
    orderDirection: 'desc',
    where: {
      pair: address,
      chain,
    },
  });

  const fetchResult = useQuery({
    ...query,
    enabled: !!address,
  });

  const swapList = fetchResult.data?.swaps;

  return {
    ...fetchResult,
    swapList,
  };
}
