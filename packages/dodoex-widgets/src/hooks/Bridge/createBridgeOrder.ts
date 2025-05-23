import {
  Cross_Chain_Swap_Zetachain_OrderCreateQuery,
  Cross_Chain_Swap_ZetachainorderCreateData,
  GraphQLRequests,
  SwapApi,
} from '@dodoex/api';
import { BridgeRouteI } from './useFetchRoutePriceBridge';

export async function createBridgeOrder({
  graphQLRequests,
  tx,
  route,
}: {
  graphQLRequests: GraphQLRequests;
  tx: string;
  route: BridgeRouteI;
}) {
  const { sourceRoute } = route;
  const createParams: Cross_Chain_Swap_ZetachainorderCreateData = {
    fromHash: tx,
    ...sourceRoute,
  };

  const result = await graphQLRequests.getData<
    Cross_Chain_Swap_Zetachain_OrderCreateQuery,
    {
      data?: Cross_Chain_Swap_ZetachainorderCreateData;
    }
  >(SwapApi.graphql.cross_chain_swap_zetachain_orderCreate.toString(), {
    data: createParams,
  });

  return result.cross_chain_swap_zetachain_orderCreate?.success;
}
