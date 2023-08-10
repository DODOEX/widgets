import { useWeb3React } from '@web3-react/core';
import { useCallback, useMemo } from 'react';
import { useSelector } from 'react-redux';
import {
  basicTokenMap,
  ChainId,
  etherTokenAddress,
} from '../../constants/chains';
import { getAccountBalances, getEthBalance } from '../../store/selectors/token';
import { TokenInfo } from './type';
import { isSameAddress } from '../../utils';

export default function useGetBalance() {
  const { account, chainId } = useWeb3React();
  const accountBalances = useSelector(getAccountBalances);
  const ethBalance = useSelector(getEthBalance);
  const getBalance = useCallback(
    (token: TokenInfo) => {
      if (!account || !token) return null;
      // cross-chain basic token
      if (isSameAddress(token.address, etherTokenAddress)) {
        const currentChainIdEthBalance =
          ethBalance[token.chainId ?? chainId ?? 1];
        return !currentChainIdEthBalance || currentChainIdEthBalance?.isNaN()
          ? null
          : currentChainIdEthBalance;
      }
      const balance =
        accountBalances[token.address.toLocaleLowerCase()]?.tokenBalances;
      return !balance || balance?.isNaN() ? null : balance;
    },
    [accountBalances, ethBalance, account],
  );

  return getBalance;
}
