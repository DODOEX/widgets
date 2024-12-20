import { MiningApi } from '@dodoex/api';
import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { useGraphQLRequests } from '../../../hooks/useGraphQLRequests';
import { TabMiningI } from '../types';
import { transformRawMiningToTabMining } from './helper';
import { MINING_POOL_REFETCH_INTERVAL } from './utils';

export function useMiningList({
  isEnded,
  searchText,
  account,
  chainIds,
}: {
  isEnded: boolean | undefined;
  searchText: string | undefined;
  account: string | undefined;
  chainIds: Array<number> | null;
}) {
  const graphQLRequests = useGraphQLRequests();
  const query = graphQLRequests.getQuery(MiningApi.graphql.fetchMiningListV1, {
    where: {
      chainIds,
      user: account,
      filterState: {
        address: searchText,
        isEnded,
      },
    },
  });
  const { data, error, refetch, isLoading, isPending } = useQuery({
    ...query,
    enabled: true,
    refetchInterval: MINING_POOL_REFETCH_INTERVAL,
  });

  const miningList = useMemo(() => {
    if (!data || !data.mining_list || !data.mining_list.list) {
      return [];
    }
    const {
      mining_list: { list },
    } = data;
    const miningList: Array<TabMiningI> = [];
    list.forEach((v) => {
      const miningItem = transformRawMiningToTabMining(v);
      if (miningItem) {
        if (miningItem.chainId === 5) {
          if (
            miningItem.stakeTokenAddress ===
              '0xf130ca2b7031672292f96c89b5b94eb5c4dc39ad' ||
            miningItem.stakeTokenAddress ===
              '0xeb977bbeb99f05e85f4a2c4678e35c387b6b7984'
          ) {
            miningList.push(miningItem);
          }
        } else {
          miningList.push(miningItem);
        }
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
