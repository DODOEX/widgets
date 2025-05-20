import { ContractRequests, TokenApi, ChainId } from '@dodoex/api';
import { getRpcSingleUrlMap } from './chains';

export enum APIServiceKey {
  routePrice = 'routePrice',
  fiatPrice = 'fiatPrice',
  bridgeRoutePrice = 'bridgeRoutePrice',
  bridgeEncode = 'bridgeEncode',
  bridgeCreateRoute = 'bridgeCreateRoute',
}

export type APIServices = {
  [key in APIServiceKey]: string;
};

export const AppUrl = `https://app.dodoex.io`;

export const getCGTokenListAPI = (chainId: ChainId) => {
  const defaultCGAPI = 'https://tokens.coingecko.com/uniswap/all.json';
  const cgAPIMap: any = {
    [ChainId.ARBITRUM_ONE]:
      'https://tokens.coingecko.com/arbitrum-one/all.json',
    [ChainId.AURORA]: 'https://tokens.coingecko.com/aurora/all.json',
    [ChainId.BSC]: 'https://tokens.coingecko.com/binance-smart-chain/all.json',
  };
  return cgAPIMap[chainId] || defaultCGAPI;
};

const BridgeUrlPrefix = 'https://api.dodoex.io/cross-chain/widget';

/**
https://api.dodoex.io/route-service/zetachain/swap?apikey=d5f476a6fd58e5e989&slippage=5&chainId=7001&source=dodoMix&fromTokenAddress=0x4bC32034caCcc9B7e02536945eDbC286bACbA073&toTokenAddress=0xcC683A782f4B30c138787CB5576a86AF66fdc31d&fromAmount=100000&userAddr=0x996AF9757c4995A91E3A9b2fAd59e72eE4436382
 */
export const RoutePriceAPI = `https://api.dodoex.io/route-service/zetachain/swap`;
export const FiatPriceAPI = `https://api.dodoex.io/frontend-price-api/current/batch`;
const BridgeRoutePriceAPI = `${BridgeUrlPrefix}/routes`;
const BridgeEncodeAPI = `${BridgeUrlPrefix}/transaction/encode`;
const BridgeCreateRouteAPI = `${BridgeUrlPrefix}/order/create`;

export function getAPIService(
  key: APIServiceKey,
  serviceProps: Partial<APIServices> = {},
) {
  switch (key) {
    case APIServiceKey.routePrice:
      return serviceProps.routePrice ?? RoutePriceAPI;
    case APIServiceKey.fiatPrice:
      return serviceProps.fiatPrice ?? FiatPriceAPI;
    case APIServiceKey.bridgeRoutePrice:
      return serviceProps.bridgeRoutePrice ?? BridgeRoutePriceAPI;
    case APIServiceKey.bridgeEncode:
      return serviceProps.bridgeEncode ?? BridgeEncodeAPI;
    case APIServiceKey.bridgeCreateRoute:
      return serviceProps.bridgeCreateRoute ?? BridgeCreateRouteAPI;

    default:
      throw new Error(`Invalid key = ${key}`);
  }
}

export const contractRequests = new ContractRequests({
  rpc: getRpcSingleUrlMap(),
  // debugQuery: process.env.NODE_ENV === 'development',
  // debugProvider: process.env.NODE_ENV === 'development',
});
export const tokenContractRequests = contractRequests.createContractRequests();
export const tokenApi = new TokenApi({
  contractRequests: tokenContractRequests,
});
