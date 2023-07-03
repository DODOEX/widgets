import { useWeb3React } from '@web3-react/core';
import BigNumber from 'bignumber.js';
import { JsonRpcProvider } from '@ethersproject/providers';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getLatestBlockNumber } from '../../store/selectors/wallet';
import { AppThunkDispatch } from '../../store/actions';
import { setEthBalance } from '../../store/actions/token';
import { getGlobalProps } from '../../store/selectors/globals';
import { ChainId, rpcServerMap } from '../../constants/chains';

export default function useFetchETHBalance(chainId?: number) {
  const { provider, account, chainId: connectChainId } = useWeb3React();
  const dispatch = useDispatch<AppThunkDispatch>();
  const blockNumber = useSelector(getLatestBlockNumber);
  const jsonRpcUrlMapProps = useSelector(getGlobalProps).jsonRpcUrlMap;
  useEffect(() => {
    const computed = async () => {
      if (!provider || !account) return;
      if (!chainId || chainId === connectChainId) {
        const balance = await provider.getBalance(account);
        dispatch(
          setEthBalance(
            connectChainId ?? 1,
            new BigNumber(balance.toString()).div(1e18),
          ),
        );
      } else {
        const jsonRpcUrlMap = {
          ...rpcServerMap,
          ...jsonRpcUrlMapProps,
        };
        const rpcUrls = jsonRpcUrlMap[chainId as ChainId];
        const provider = new JsonRpcProvider(rpcUrls?.[0]);
        const balance = await provider.getBalance(account);
        if (balance) {
          dispatch(
            setEthBalance(chainId, new BigNumber(balance.toString()).div(1e18)),
          );
        }
      }
    };
    computed();
  }, [provider, account, dispatch, blockNumber, chainId]);
}
