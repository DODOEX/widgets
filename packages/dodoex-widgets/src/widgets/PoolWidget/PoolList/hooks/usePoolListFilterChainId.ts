import { useWeb3React } from '@web3-react/core';
import React from 'react';
import { isTestNet } from '../../../../constants/chainList';
import { ChainId } from '@dodoex/api';
import { POOLS_LIST_FILTER_CHAIN } from '../../../../constants/sessionStorage';
import { useUserOptions } from '../../../../components/UserOptionsProvider';

export function usePoolListFilterChainId() {
  const { chainId: currentChainId } = useWeb3React();
  const { onlyChainId, defaultChainId, supportChainIds } = useUserOptions();
  const [activeChainId, setActiveChainId] = React.useState<ChainId | undefined>(
    onlyChainId,
  );

  const filterChainIds = React.useMemo(() => {
    if (activeChainId !== undefined) return [activeChainId];

    if (isTestNet(currentChainId as ChainId)) {
      return undefined;
    }
    if (supportChainIds?.length) return supportChainIds as ChainId[];
    return Object.values(ChainId).filter(
      (chainId) => !!Number(chainId),
    ) as ChainId[];
  }, [currentChainId, activeChainId, supportChainIds]);

  React.useEffect(() => {
    const activeChainIdCache = Number(
      sessionStorage.getItem(POOLS_LIST_FILTER_CHAIN),
    );
    if (activeChainIdCache) {
      setActiveChainId(activeChainIdCache);
    }
  }, []);
  React.useEffect(() => {
    const activeChainIdCache = sessionStorage.getItem(POOLS_LIST_FILTER_CHAIN);
    if (!activeChainIdCache && defaultChainId) {
      setActiveChainId(defaultChainId);
    }
  }, [defaultChainId]);

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
