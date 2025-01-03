import { useWeb3React } from '@web3-react/core';
import { useCallback, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { AppThunkDispatch } from '../../store/actions';
import { setBlockNumber } from '../../store/actions/wallet';

export default function useFetchBlockNumber() {
  const { provider, chainId } = useWeb3React();

  const dispatch = useDispatch<AppThunkDispatch>();

  const updateBlockNumber = useCallback(async () => {
    if (!provider || !chainId) {
      return;
    }
    try {
      const blockNumber = await provider.getBlockNumber();
      dispatch(setBlockNumber(blockNumber));
    } catch (error) {
      console.error('Failed to fetch block number', error);
    }
  }, [provider, chainId, dispatch]);

  useEffect(() => {
    updateBlockNumber();
  }, [updateBlockNumber]);

  return {
    updateBlockNumber,
  };
}
