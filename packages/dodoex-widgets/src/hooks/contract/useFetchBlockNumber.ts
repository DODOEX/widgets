import { useWeb3React } from '@web3-react/core';
import { useCallback, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { AppThunkDispatch } from '../../store/actions';
import { setBlockNumber } from '../../store/actions/wallet';
import { useSolanaConnection } from '../solana/useSolanaConnection';
import { useUserOptions } from '../../components/UserOptionsProvider';

export default function useFetchBlockNumber() {
  const { provider, chainId } = useWeb3React();
  const { onlySolana } = useUserOptions();
  const { fetchBlockNumber } = useSolanaConnection();

  const dispatch = useDispatch<AppThunkDispatch>();

  const updateBlockNumber = useCallback(async () => {
    if (onlySolana) {
      try {
        const blockNumber = await fetchBlockNumber();
        dispatch(setBlockNumber(blockNumber));
      } catch (error) {}
    }
    if (!provider || !chainId) {
      return;
    }
    try {
      const blockNumber = await provider.getBlockNumber();
      dispatch(setBlockNumber(blockNumber));
    } catch (error) {
      console.error('Failed to fetch block number', error);
    }
  }, [provider, chainId, dispatch, onlySolana, fetchBlockNumber]);

  useEffect(() => {
    updateBlockNumber();
  }, [updateBlockNumber]);

  return {
    updateBlockNumber,
  };
}
