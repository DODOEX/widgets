import { ChainId, CurveApi } from '@dodoex/api';
import { useQuery } from '@tanstack/react-query';
import { useGraphQLRequests } from '../../../../hooks/useGraphQLRequests';

export function usePoolSwapList({
  chainId,
  address,
}: {
  chainId: number | undefined;
  address: string | undefined;
}) {
  const graphQLRequests = useGraphQLRequests();
  const query = graphQLRequests.getQuery(
    CurveApi.graphql.curve_stableswap_ng_getPoolSwapInfo,
    {
      where: {
        chainId: chainId ?? ChainId.ZETACHAIN,
        poolAddress: address ?? '',
      },
    },
  );

  const fetchResult = useQuery({
    ...query,
    enabled: !!address && !!chainId,
  });

  const swapList = fetchResult.data?.curve_stableswap_ng_getPoolSwapInfo?.swaps;

  return {
    ...fetchResult,
    swapList,
  };
}
