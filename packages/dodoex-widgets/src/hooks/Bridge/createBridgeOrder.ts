import axios from 'axios';
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
    lifiBridge: Exclude<BridgeRouteI['sourceRoute'], undefined>['step']['tool'];
    route: BridgeRouteI['sourceRoute'];
    productParams: BridgeRouteI['productParams'];
    encodeId: string;
    source: string;
  };
}

export async function createBridgeOrder({
  apikey,
  tx,
  route,
  bridgeCreateRouteAPI,
  encodeId,
}: {
  apikey?: string;
  tx: string;
  route: BridgeRouteI;
  bridgeCreateRouteAPI: string;
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
  if (!sourceRoute) {
    throw new Error('sourceRoute is required');
  }
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
  const result = await axios.post(
    `${bridgeCreateRouteAPI}${apikey ? `?apikey=${apikey}` : ''}`,
    {
      data: createParams,
    },
  );
  const data = result.data.data;

  return data?.id;
}
