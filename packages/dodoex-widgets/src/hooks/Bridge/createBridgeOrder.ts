import axios from 'axios';
import { BridgeCreateRouteAPI } from '../../constants/api';
import { toWei } from '../../utils';
import { TokenInfo } from '../Token';
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
  };
}

export async function createBridgeOrder({
  apikey,
  tx,
  route,
}: {
  apikey: string;
  tx: string;
  route: BridgeRouteI;
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
    },
  } as BridgeOrderCreateParams;
  const result = await axios.post(`${BridgeCreateRouteAPI}?apikey=${apikey}`, {
    data: createParams,
  });
  const data = result.data.data;

  return data?.id;
}
