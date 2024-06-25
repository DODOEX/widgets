import { useWeb3React } from '@web3-react/core';
import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { ChainId } from '@dodoex/api';
import { getDefaultChainId } from '../../store/selectors/wallet';

export function useCurrentChainId() {
  const { chainId } = useWeb3React();
  const defaultChainId = useSelector(getDefaultChainId);

  return useMemo(
    () => (chainId || defaultChainId || 1) as ChainId,
    [chainId, defaultChainId],
  );
}
