import { useQuery } from '@tanstack/react-query';
import { ChainId, cpGraphqlQuery, platformIdMap } from '@dodoex/api';
import { useGraphQLRequests } from '../../../../hooks/useGraphQLRequests';
import { useMemo } from 'react';

export function useFetchCpVote({
  chainId,
  cpAddress,
}: {
  chainId: number | undefined;
  cpAddress: string | undefined;
}) {
  const graphQLRequests = useGraphQLRequests();

  const chain = platformIdMap[chainId as ChainId];
  const query = useQuery({
    ...graphQLRequests.getQuery(cpGraphqlQuery.fetchIOPCPList, {
      where: {
        address: cpAddress?.toLowerCase(),
        chain,
      },
      voteWhere: {
        chain,
        refreshNow: true,
      },
    }),
    enabled: chainId !== undefined && !!cpAddress,
  });

  const iopCrowdpoolings = useMemo(() => {
    const resList =
      query.data?.crowd_pooling_read_server_list?.map((cp) => {
        return {
          ...cp,
          votes:
            cp?.votes?.map((vote) => {
              const cpVote =
                query.data?.crowd_pooling_read_server_voteList?.find(
                  (item) => item?.id === vote?.id,
                );
              return {
                ...vote,
                creator: cpVote?.account?.address,
              };
            }) ?? [],
        };
      }) ?? [];
    return resList;
  }, [query.data]);

  const voteAccounts = useMemo(() => {
    const result: string[] = [];
    iopCrowdpoolings.forEach((item) => {
      item.votes.forEach((vote) => {
        if (vote.creator && !result.includes(vote.creator)) {
          result.push(vote.creator);
        }
      });
    });
    return result;
  }, [iopCrowdpoolings]);

  return {
    ...query,
    iopCrowdpoolings,
    voteAccounts,
  };
}
