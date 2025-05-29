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
  calldata,
}: {
  graphQLRequests: GraphQLRequests;
  tx: string;
  route: BridgeRouteI;
  calldata: string;
}) {
  const { sourceRoute } = route;
  const { approveTarget, encodeParams, ...rest } = sourceRoute ?? {};
  const createParams: Cross_Chain_Swap_ZetachainorderCreateData = {
    fromHash: tx,
    ...rest,
    calldata,
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
