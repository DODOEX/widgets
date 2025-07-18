import { ChainId, CurveApi } from '@dodoex/api';
import { useQuery } from '@tanstack/react-query';
import { useGraphQLRequests } from '../../../../hooks/useGraphQLRequests';

export function useLiquidityProviders({
  chainId,
  address,
}: {
  chainId: number | undefined;
  address: string | undefined;
}) {
  const graphQLRequests = useGraphQLRequests();
  const fetchPositionsQuery = useQuery({
    ...graphQLRequests.getQuery(
      CurveApi.graphql.curve_stableswap_ng_getPoolLiquidityHistory,
      {
        where: {
          chainId: chainId ?? ChainId.ZETACHAIN,
          poolAddress: address ?? '',
        },
      },
    ),
    enabled: !!address && !!chainId,
  });

  return {
    ...fetchPositionsQuery,
    list: fetchPositionsQuery.data?.curve_stableswap_ng_getPoolLiquidityHistory
      ?.liquidityHistories,
  };
}
