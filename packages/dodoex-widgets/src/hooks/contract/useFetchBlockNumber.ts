import { useCallback, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { AppThunkDispatch } from '../../store/actions';
import { setBlockNumber } from '../../store/actions/wallet';
import { useSolanaConnection } from '../solana/useSolanaConnection';

export default function useFetchBlockNumber() {
  const { fetchBlockNumber } = useSolanaConnection();

  const dispatch = useDispatch<AppThunkDispatch>();

  const updateBlockNumber = useCallback(async () => {
    try {
      const blockNumber = await fetchBlockNumber();
      console.log('blockNumber', blockNumber);
      dispatch(setBlockNumber(blockNumber));
    } catch (error) {}
  }, [dispatch, fetchBlockNumber]);

  useEffect(() => {
    updateBlockNumber();
  }, [updateBlockNumber]);

  return {
    updateBlockNumber,
  };
}
