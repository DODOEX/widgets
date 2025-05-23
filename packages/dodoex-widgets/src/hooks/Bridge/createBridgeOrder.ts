import {
  Cross_Chain_Swap_Zetachain_OrderCreateQuery,
  GraphQLRequests,
  SwapApi,
} from '@dodoex/api';
import { Cross_Chain_Swap_ZetachainorderCreateData } from '@dodoex/api/dist/types/gql/graphql';
import { toWei } from '../../utils';
import { BridgeRouteI } from './useFetchRoutePriceBridge';

export interface BridgeOrderCreateParams {
  fromChainId: number;
  fromAmount: string;
  fromTokenAddress: string;
  toChainId: number;
  toAmount: string;
  toTokenAddress: string;
  fromAddress: string;
  toAddress: string;
  slippage: number;
  hash: string;
  product: string | null;
  extend: {
    // from route.step.tool
    lifiBridge: BridgeRouteI['sourceRoute']['step']['tool'];
    route: BridgeRouteI['sourceRoute'];
    productParams: BridgeRouteI['productParams'];
    encodeId: string;
    source: string;
  };
}

export async function createBridgeOrder({
  graphQLRequests,
  tx,
  route,
  encodeId,
}: {
  graphQLRequests: GraphQLRequests;
  tx: string;
  route: BridgeRouteI;
  encodeId: string;
}) {
  const {
    fromChainId,
    toChainId,
    fromAmount,
    fromToken,
    toToken,
    fromAddress,
    toAddress,
    slippage,
    product,
    step,
    sourceRoute,
    productParams,
  } = route;
  const { toAmount } = sourceRoute;
  const createParams = {
    fromChainId,
    fromAmount: toWei(fromAmount, fromToken.decimals).toString(),
    fromTokenAddress: fromToken.address,
    toChainId,
    toAmount,
    toTokenAddress: toToken.address,
    fromAddress,
    toAddress,
    slippage,
    hash: tx,
    product,
    extend: {
      lifiBridge: step.tool,
      route: sourceRoute,
      productParams,
      encodeId,
      source: 'widget',
    },
  } as BridgeOrderCreateParams;

  const result = await graphQLRequests.getData<
    Cross_Chain_Swap_Zetachain_OrderCreateQuery,
    {
      data?: Cross_Chain_Swap_ZetachainorderCreateData;
    }
  >(SwapApi.graphql.cross_chain_swap_zetachain_orderCreate.toString(), {
    data: {
      ...createParams,
    },
  });

  return result.cross_chain_swap_zetachain_orderCreate?.success;
}
