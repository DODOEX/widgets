import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { ChainId } from '../../constants/chains';
import { getDefaultChainId } from '../../store/selectors/wallet';
import { useWalletState } from './useWalletState';

export function useCurrentChainId() {
  const { chainId } = useWalletState();
  const defaultChainId = useSelector(getDefaultChainId);

  return useMemo(
    () => (chainId || defaultChainId || 1) as ChainId,
    [chainId, defaultChainId],
  );
}
