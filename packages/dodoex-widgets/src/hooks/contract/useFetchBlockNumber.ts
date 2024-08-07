import { useEffect, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { AppThunkDispatch } from '../../store/actions';
import { setBlockNumber } from '../../store/actions/wallet';
import { debounce } from 'lodash';
import { useWalletState } from '../ConnectWallet/useWalletState';

export default function useFetchBlockNumber() {
  const { getLastBlockNumber, chainId } = useWalletState();
  const dispatch = useDispatch<AppThunkDispatch>();
  const updateBlockNumber = useCallback(async () => {
    if (!getLastBlockNumber || !chainId) return;
    const blockNumber = await getLastBlockNumber();
    dispatch(setBlockNumber(blockNumber));
  }, [getLastBlockNumber, chainId]);
  return {
    updateBlockNumber,
  };
}
