import BigNumber from 'bignumber.js';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getLatestBlockNumber } from '../../store/selectors/wallet';
import { AppThunkDispatch } from '../../store/actions';
import { setEthBalance } from '../../store/actions/token';
import { getGlobalProps } from '../../store/selectors/globals';
import { ChainId, rpcServerMap } from '../../constants/chains';
import { getStaticJsonRpcProvider } from './provider';
import { useWalletState } from '../ConnectWallet/useWalletState';

export default function useFetchETHBalance(chainId?: number) {
  const {
    getBalance,
    account,
    chainId: connectChainId,
    evmAccount,
  } = useWalletState();
  const dispatch = useDispatch<AppThunkDispatch>();
  const blockNumber = useSelector(getLatestBlockNumber);
  const jsonRpcUrlMapProps = useSelector(getGlobalProps).jsonRpcUrlMap;
  useEffect(() => {
    const computed = async () => {
      if (!getBalance || !account) return;
      if (!chainId || chainId === connectChainId) {
        const balance = await getBalance(account);
        if (balance) {
          dispatch(setEthBalance(connectChainId ?? 1, balance));
        }
      } else if (chainId !== ChainId.TON && evmAccount) {
        const jsonRpcUrlMap = {
          ...rpcServerMap,
          ...jsonRpcUrlMapProps,
        };
        const rpcUrls = jsonRpcUrlMap[chainId as ChainId];
        const provider = getStaticJsonRpcProvider(rpcUrls?.[0], chainId);
        const balance = await provider.getBalance(evmAccount);
        if (balance) {
          dispatch(
            setEthBalance(chainId, new BigNumber(balance.toString()).div(1e18)),
          );
        }
      }
    };
    computed();
  }, [getBalance, account, dispatch, blockNumber, chainId, evmAccount]);
}
