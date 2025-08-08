import { ChainId } from '@dodoex/api';
import { chainListMap } from './chainList';

export const EmptyAddress = '0x0000000000000000000000000000000000000000';

export const solanaFallbackAddress =
  'CVVQYs9Pi3t4it4KFpm3hxk97uDA6AVzNVJvGQTPH17n';

export const btcFallbackAddress = 'tb1qcrd8yvatjzpxl0ew29jsps2z595jpwtm5mj38v';

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
