import { useWeb3React } from '@web3-react/core';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { AppThunkDispatch } from '../../store/actions';
import { setBlockNumber } from '../../store/actions/wallet';

export default function useFetchBlockNumber() {
  const { provider, chainId } = useWeb3React();
  const dispatch = useDispatch<AppThunkDispatch>();
  useEffect(() => {
    const handleChangeBlock = (blockNumber: number) => {
      dispatch(setBlockNumber(blockNumber));
    };
    const computed = async () => {
      if (!provider || !chainId) return;
      const blockNumber = await provider.getBlockNumber();
      handleChangeBlock(blockNumber);
      provider.on('block', handleChangeBlock);
    };
    computed();

    return () => {
      provider?.off('block', handleChangeBlock);
    };
  }, [provider, dispatch, chainId]);
}
