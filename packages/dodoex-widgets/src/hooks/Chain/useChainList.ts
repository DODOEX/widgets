import { useMemo } from 'react';
import { ChainId } from '@dodoex/api';
import { ChainListItem, chainListMap } from '../../constants/chainList';
import { useUserOptions } from '../../components/UserOptionsProvider';
import { useWalletInfo } from '../ConnectWallet/useWalletInfo';

export function useChainList() {
  const { chainId } = useWalletInfo();
  const { supportChainIds } = useUserOptions();
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
      if (supportChainIds?.length && !supportChainIds?.includes(chain.chainId))
        return;
      currentChainListMap.set(key as unknown as ChainId, { ...chain });
    });
    if (replaceChainId !== undefined) {
      currentChainListMap.delete(replaceChainId);
    }
    return Array.from(currentChainListMap.values());
  }, [chainId]);

  return chainList;
}
