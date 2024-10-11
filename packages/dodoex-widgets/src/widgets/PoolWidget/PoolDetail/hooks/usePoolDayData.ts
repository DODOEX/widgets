import { ChainId, PoolApi } from '@dodoex/api';
import { useQuery } from '@tanstack/react-query';
import BigNumber from 'bignumber.js';
import { ThegraphKeyMap } from '../../../../constants/chains';
import { useGraphQLRequests } from '../../../../hooks/useGraphQLRequests';

function toNumber(v: string | number | null | undefined) {
  if (v === null || v === undefined) {
    return 0;
  }
  return new BigNumber(v).dp(4, BigNumber.ROUND_DOWN).toNumber();
}

export function usePoolDayData({
  address,
  chainId,
  day,
}: {
  address: string | undefined;
  chainId: ChainId | undefined;
  day?: number;
}) {
  const chain = chainId ? ThegraphKeyMap[chainId] : '';
  const graphQLRequests = useGraphQLRequests();
  const query = graphQLRequests.getQuery(PoolApi.graphql.fetchPoolDayData, {
    where: {
      pair_address: address ?? '',
      chain,
      day,
    },
  });
  const result = useQuery({
    ...query,
    enabled: !!address && !!chainId,
  });

  const dayDataList =
    result.data?.dashboard_pairs_day_data?.map((item) => ({
      volume: toNumber(item?.volume),
      fee: toNumber(item?.fee),
      traders: item?.addresses ? Number(item.addresses) : 0,
      date: item?.timestamp ? item?.timestamp * 1000 : 0,
      tvl: toNumber(item?.tvl),
    })) ?? [];

  return {
    ...result,
    dayDataList,
  };
}
