import { ChainId } from '@dodoex/api';
export { basicTokenMap } from '@dodoex/api';

export const rpcServerMap: {
  [key in ChainId]: Array<string>;
} = {
  [ChainId.SOON_TESTNET]: ['https://rpc.testnet.soo.network/rpc'],
  [ChainId.SOON]: ['https://rpc.testnet.soo.network/rpc'],
};
export const getRpcSingleUrlMap = (newRpcServerMap?: {
  [chainId: number]: string[];
}) => {
  const result = {} as {
    [key in ChainId]?: string;
  };
  Object.entries(rpcServerMap).forEach(([key, urls]) => {
    const chainId = Number(key) as ChainId;
    const urlsResult = newRpcServerMap?.[chainId] || urls;
    const [url] = urlsResult;
    if (url) {
      result[chainId] = url;
    }
  });
  return result as {
    [key in ChainId]: string;
  };
};

export const scanUrlDomainMap: {
  [key in ChainId]: string;
} = {
  [ChainId.SOON_TESTNET]: 'explorer.testnet.soo.network',
  [ChainId.SOON]: 'explorer.testnet.soo.network',
};

export const ThegraphKeyMap: {
  [key in ChainId]: string;
} = {
  [ChainId.SOON_TESTNET]: 'soon-testnet',
  [ChainId.SOON]: 'soon',
};

export const blockTimeMap: {
  [key in ChainId]: number;
} = {
  [ChainId.SOON_TESTNET]: 12000,
  [ChainId.SOON]: 12000,
};

export const dexKeysMap: {
  [key in ChainId]: string[];
} = {
  [ChainId.SOON_TESTNET]: [],
  [ChainId.SOON]: [],
};
