import { useWeb3React } from '@web3-react/core';
import { useEffect, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { AppThunkDispatch } from '../../store/actions';
import { setBlockNumber } from '../../store/actions/wallet';
import { debounce } from 'lodash';

export default function useFetchBlockNumber() {
  const { provider, chainId } = useWeb3React();
  const dispatch = useDispatch<AppThunkDispatch>();
  const updateBlockNumber = useCallback(async () => {
    if (!provider || !chainId) return;
    const blockNumber = await provider.getBlockNumber();
    dispatch(setBlockNumber(blockNumber));
  }, [provider, chainId]);
  return {
    updateBlockNumber
  }
}
