import { useWeb3React } from '@web3-react/core';
import { useMemo } from 'react';
import { ChainId } from '../../constants/chains';
import { ChainListItem, chainListMap } from '../../constants/chainList';

export function useChainList() {
  const { chainId } = useWeb3React();
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
