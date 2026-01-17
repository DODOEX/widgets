import { useGraphQLRequests } from '../../../../hooks/useGraphQLRequests';
import { cpGraphqlQuery, platformIdMap } from '@dodoex/api';
import { useWalletInfo } from '../../../../hooks/ConnectWallet/useWalletInfo';
import { useQuery } from '@tanstack/react-query';
import { formatCP } from '../../helper';

export function useMyCPList() {
  const { account, queryChainId: chainId } = useWalletInfo();
  const graphQLRequests = useGraphQLRequests();
  const platformId = chainId ? platformIdMap[chainId] : undefined;
  const query = graphQLRequests.getQuery(cpGraphqlQuery.fetchCPList, {
    first: 1000,
    where: {
      chain: platformId,
      creator: account,
      refreshNow: true,
    },
  });
  const queryResult = useQuery({
    ...query,
    queryFn: async () => {
      const result = await query.queryFn();
      return formatCP({
        crowdpoolings: result.crowdPoolings,
        chainId,
      });
    },
    enabled: !!account,
  });

  return queryResult;
}
