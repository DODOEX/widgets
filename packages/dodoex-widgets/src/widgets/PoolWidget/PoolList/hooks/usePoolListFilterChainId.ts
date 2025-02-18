import { ChainId } from '@dodoex/api';
import React from 'react';
import { useUserOptions } from '../../../../components/UserOptionsProvider';
import { isTestNet } from '../../../../constants/chainList';
import { POOLS_LIST_FILTER_CHAIN } from '../../../../constants/sessionStorage';
import { useWalletInfo } from '../../../../hooks/ConnectWallet/useWalletInfo';

export function usePoolListFilterChainId() {
  const { chainId: currentChainId } = useWalletInfo();
  const { onlyChainId } = useUserOptions();
  const [activeChainId, setActiveChainId] =
    React.useState<ChainId | undefined>(onlyChainId);

  const filterChainIds = React.useMemo(() => {
    if (activeChainId !== undefined) return [activeChainId];

    if (isTestNet(currentChainId as ChainId)) {
      return undefined;
    }
    return Object.values(ChainId).filter(
      (chainId) => !!Number(chainId),
    ) as ChainId[];
  }, [currentChainId, activeChainId]);

  React.useEffect(() => {
    const activeChainIdCache = sessionStorage.getItem(POOLS_LIST_FILTER_CHAIN);
    if (activeChainIdCache) {
      setActiveChainId(Number(activeChainIdCache));
    }
  }, []);

  const handleChangeActiveChainId = (chainId: number | undefined) => {
    if (chainId === undefined) {
      sessionStorage.removeItem(POOLS_LIST_FILTER_CHAIN);
    } else {
      sessionStorage.setItem(POOLS_LIST_FILTER_CHAIN, String(chainId));
    }
    setActiveChainId(chainId);
  };

  return {
    activeChainId,
    filterChainIds,
    handleChangeActiveChainId,
  };
}
