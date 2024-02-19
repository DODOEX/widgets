import { useWeb3React } from '@web3-react/core';
import { useMemo } from 'react';
import { isTestNet } from '../../../../constants/chainList';
import { ChainId } from '../../../../constants/chains';

export function useFilterChainIds({
  activeChainId,
}: {
  activeChainId: ChainId | undefined;
}) {
  const { chainId: currentChainId } = useWeb3React();

  const filterChainIds = useMemo(() => {
    if (activeChainId !== undefined) return [activeChainId];

    if (isTestNet(currentChainId as ChainId)) {
      return undefined;
    }
    return Object.values(ChainId).filter(
      (chainId) => !!Number(chainId),
    ) as ChainId[];
  }, [currentChainId, activeChainId]);

  return filterChainIds;
}
