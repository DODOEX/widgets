import { ChainId, PoolApi } from '@dodoex/api';
import { useQuery } from '@tanstack/react-query';
import { ThegraphKeyMap } from '../../../../constants/chains';
import { useGraphQLRequests } from '../../../../hooks/useGraphQLRequests';

export function usePoolDashboard({
  address,
  chainId,
}: {
  address: string | undefined;
  chainId: ChainId | undefined;
}) {
  const graphQLRequests = useGraphQLRequests();
  const chain = chainId ? ThegraphKeyMap[chainId] : '';
  const query = graphQLRequests.getQuery(PoolApi.graphql.fetchPoolDashboard, {
    where: {
      pair_address: address ?? '',
      chain,
    },
  });
  const result = useQuery({
    ...query,
    enabled: !!address && !!chainId,
  });

  const dashboard = result.data?.dashboard_pairs_detail;

  return {
    ...result,
    dashboard,
  };
}
