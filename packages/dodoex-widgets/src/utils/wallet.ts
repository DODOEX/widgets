import { ChainId } from '@dodoex/api';
import { scanUrlDomainMap } from '../constants/chains';
import { CaipNetworksUtil } from '@reown/appkit-utils';
import { chainListMap } from '../constants/chainList';

export const isETHChain = (
  chainId?: number,
): {
  /** ETH mainnet */
  isMainnet: boolean;
  isRinkeby: boolean;
  isETH: boolean;
  isGor: boolean;
} => {
  const result = {
    isMainnet: chainId === 1,
    isRinkeby: chainId === 4,
    isGor: chainId === 5,
  };
  return {
    ...result,
    isETH: result.isMainnet || result.isRinkeby || result.isGor,
  };
};

export const reloadWindow = (interval?: number) => {
  setTimeout(() => {
    window.location.reload();
  }, interval || 100);
};

export function namespaceToTitle(chainId: ChainId | undefined) {
  if (!chainId) {
    return 'a';
  }
  const caipNetwork = chainListMap.get(chainId)?.caipNetwork;
  if (!caipNetwork) {
    return '';
  }
  const namespace = CaipNetworksUtil.getChainNamespace(caipNetwork);

  if (!namespace) {
    return '';
  }

  switch (namespace) {
    case 'eip155':
      return 'EVM';
    case 'solana':
      return 'Solana';
    case 'bip122':
      return 'Bitcoin';
    default:
      return namespace;
  }
}
