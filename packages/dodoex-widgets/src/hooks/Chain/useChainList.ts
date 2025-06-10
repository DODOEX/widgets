import { ChainId } from '@dodoex/api';
import { useMemo } from 'react';
import { ChainListItem, chainListMap } from '../../constants/chainList';
import { useWalletInfo } from '../ConnectWallet/useWalletInfo';

export function useChainList() {
  const { chainId } = useWalletInfo();

  const chainList = useMemo(() => {
    const currentChainListMap = new Map<ChainId, ChainListItem>();
    let replaceChainId: ChainId | undefined;
    chainListMap.forEach((chain, key) => {
      if (chain.mainnet) {
        if (chainId !== chain.chainId) {
          return;
        }
        replaceChainId = chain.mainnet;
      }
      currentChainListMap.set(key as unknown as ChainId, { ...chain });
    });
    if (replaceChainId !== undefined) {
      currentChainListMap.delete(replaceChainId);
    }
    return Array.from(currentChainListMap.values());
  }, [chainId]);

  return chainList;
}
