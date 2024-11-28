import { ChainId } from '@dodoex/api';
import { useWeb3React } from '@web3-react/core';
import { useUserOptions } from '../../components/UserOptionsProvider';
import React from 'react';
import { useSolanaWallet } from '../solana/useSolanaWallet';

export function useWalletInfo() {
  const web3React = useWeb3React();
  const { onlyChainId, defaultChainId, onlySolana } = useUserOptions();
  const solanaWallet = useSolanaWallet();

  const [account, chainId] = React.useMemo(() => {
    if (onlySolana) {
      const solanaAccount = solanaWallet.publicKey?.toBase58();
      if (!solanaAccount) {
        return [undefined, undefined];
      }
      return [solanaAccount, -1000];
    } else {
      return [web3React.account, web3React.chainId];
    }
  }, [onlySolana, web3React.account, web3React.chainId, solanaWallet]);

  return {
    account,
    chainId: onlySolana
      ? chainId || onlyChainId || defaultChainId
      : ((chainId || onlyChainId || defaultChainId || 1) as ChainId),
    connectedChainId: chainId,
    defaultChainId,
    onlyChainId,
    isSolana: onlySolana,
  };
}
