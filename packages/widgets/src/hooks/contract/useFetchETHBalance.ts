import { useWeb3React } from '@web3-react/core';
import BigNumber from 'bignumber.js';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getLatestBlockNumber } from '../../store/selectors/wallet';
import { AppThunkDispatch } from '../../store/actions';
import { setEthBalance } from '../../store/actions/token';

export default function useFetchETHBalance() {
  const { provider, account } = useWeb3React();
  const dispatch = useDispatch<AppThunkDispatch>();
  const blockNumber = useSelector(getLatestBlockNumber);
  useEffect(() => {
    const computed = async () => {
      if (!provider || !account) return;
      const balance = await provider.getBalance(account);
      dispatch(setEthBalance(new BigNumber(balance.toString()).div(1e18)));
    };
    computed();
  }, [provider, account, dispatch, blockNumber]);
}
