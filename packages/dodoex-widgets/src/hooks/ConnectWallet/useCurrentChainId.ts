import { useWeb3React } from '@web3-react/core';
import { useMemo } from 'react';
import { useUserOptions } from '../../components/UserOptionsProvider';
import { ChainId } from '../../constants/chains';

export function useCurrentChainId() {
  const { chainId } = useWeb3React();
  const { defaultChainId } = useUserOptions();

  return useMemo(
    () => (chainId || defaultChainId || 1) as ChainId,
    [chainId, defaultChainId],
  );
}
