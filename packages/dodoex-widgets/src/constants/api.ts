import { ChainId } from './chains';

export const RoutePriceAPI = `https://api.dodoex.io/route-service/v2/widget/getdodoroute`;
export const FiatPriceAPI = `https://api.dodoex.io/frontend-price-api`;
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

const BridgeUrlPrefix = 'https://api.devus.dregon.cc/cross-chain/widget';
export const BridgeRoutePriceAPI = `${BridgeUrlPrefix}/routes`;
export const BridgeEncodeAPI = `${BridgeUrlPrefix}/transaction/encode`;
