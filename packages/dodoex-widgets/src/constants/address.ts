import { ChainId } from '@dodoex/api';
import { chainListMap } from './chainList';

export const EmptyAddress = '0x0000000000000000000000000000000000000000';

export const getFallbackAddress = (chainId: ChainId | undefined) => {
  if (!chainId) {
    return EmptyAddress;
  }

  const chain = chainListMap.get(chainId);

  if (chain) {
    return chain.fallbackAddress;
  }

  return EmptyAddress;
};
