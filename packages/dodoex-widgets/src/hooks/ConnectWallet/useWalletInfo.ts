import { ChainId } from '@dodoex/api';
import React from 'react';
import { useUserOptions } from '../../components/UserOptionsProvider';
import { useSolanaWallet } from '../solana/useSolanaWallet';

export function useWalletInfo() {
  const { onlyChainId, defaultChainId, onlySolana } = useUserOptions();
  const solanaWallet = useSolanaWallet();

  const [account, chainId] = React.useMemo(() => {
    const solanaAccount = solanaWallet.publicKey?.toBase58();
    if (!solanaAccount) {
      return [undefined, undefined];
    }
    return [solanaAccount, ChainId.SOON_TESTNET];
  }, [solanaWallet.publicKey]);

  return {
    account,
    chainId: onlySolana
      ? chainId || onlyChainId || defaultChainId
      : ((chainId ||
          onlyChainId ||
          defaultChainId ||
          ChainId.SOON_TESTNET) as ChainId),
    connectedChainId: chainId,
    defaultChainId,
    onlyChainId,
    isSolana: onlySolana,
    isActivating: solanaWallet.connecting,
  };
}
