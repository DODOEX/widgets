import { ChainId } from '@dodoex/api';
import { useWeb3React } from '@web3-react/core';
import { useUserOptions } from '../../components/UserOptionsProvider';

export function useWalletInfo() {
  const { account, chainId } = useWeb3React();
  const { onlyChainId, defaultChainId } = useUserOptions();

  return {
    account,
    chainId: (chainId || onlyChainId || defaultChainId || 1) as ChainId,
    connectedChainId: chainId,
    defaultChainId,
    onlyChainId,
  };
}
