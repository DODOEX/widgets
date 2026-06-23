import { ChainId } from '@dodoex/api';
import { useWeb3React } from '@web3-react/core';
import { JsonRpcProvider } from '@ethersproject/providers';
import { useUserOptions } from '../../components/UserOptionsProvider';

export function useWalletInfo() {
  const { account: web3Account, chainId: web3ChainId, provider: web3Provider } = useWeb3React();
  const { walletState, onlyChainId, defaultChainId } = useUserOptions();

  const account = walletState?.account ?? web3Account;
  const connectedChainId = walletState?.chainId ?? web3ChainId;
  const provider: JsonRpcProvider | undefined = walletState?.provider ?? web3Provider;

  return {
    account,
    chainId: (connectedChainId || onlyChainId || defaultChainId || 1) as ChainId,
    connectedChainId,
    provider,
    defaultChainId,
    onlyChainId,
  };
}
