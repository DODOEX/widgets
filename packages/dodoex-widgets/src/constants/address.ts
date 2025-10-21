import { ChainId } from '@dodoex/api';
import { chainListMap } from './chainList';

export const EmptyAddress = '0x0000000000000000000000000000000000000000';

export const solanaFallbackAddress =
  'CVVQYs9Pi3t4it4KFpm3hxk97uDA6AVzNVJvGQTPH17n';

export const btcFallbackAddress = 'tb1qcrd8yvatjzpxl0ew29jsps2z595jpwtm5mj38v';

export const suiFallbackAddress =
  '0xf5361d9079c5769b7b0c83841357f8f5b96d48b0477e1721e81c875ac7277e73';

export const tonFallbackAddress =
  '0QArAJPiEbfybbhm4XYU2ve5fIMozDvZvqU7wpVoKd-xJcRd';

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
