import { ChainId } from '@dodoex/api';
import { scanUrlDomainMap } from '../constants/chains';

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
