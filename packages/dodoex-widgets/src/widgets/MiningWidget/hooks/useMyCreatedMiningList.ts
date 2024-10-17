import { MiningApi } from '@dodoex/api';
import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { useGraphQLRequests } from '../../../hooks/useGraphQLRequests';
import { MyCreatedMiningI } from '../types';
import { transformRawMiningToMyCreatedMining } from './helper';
import { MINING_POOL_REFETCH_INTERVAL } from './utils';

export function useMyCreatedMiningList({
  searchText,
  account,
  chainIds,
}: {
  searchText: string | undefined;
  account: string | undefined;
  chainIds: Array<number> | null;
}) {
  const graphQLRequests = useGraphQLRequests();
  const query = graphQLRequests.getQuery(
    MiningApi.graphql.fetchMyCreatedMiningList,
    {
      where: {
        chainIds,
        user: account,
        filterState: {
          address: searchText,
          isCreateOrParticipate: true,
        },
      },
    },
  );
  const { data, error, refetch, isLoading, isPending } = useQuery({
    ...query,
    enabled: account !== undefined,
    refetchInterval: MINING_POOL_REFETCH_INTERVAL,
  });

  const miningList = useMemo(() => {
    if (!data || !data.mining_list || !data.mining_list.list) {
      return [];
    }
    const {
      mining_list: { list },
    } = data;
    const miningList: Array<MyCreatedMiningI> = [];
    list.forEach((v) => {
      const miningItem = transformRawMiningToMyCreatedMining(v);
      if (miningItem) {
        miningList.push(miningItem);
      }
      if (!miningItem) {
        console.error('miningItem is null', miningItem, v);
      }
    });
    return miningList;
  }, [data]);

  return {
    error,
    refetch,
    loading: isLoading || isPending,
    miningList,
  };
}
