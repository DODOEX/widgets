import { useWeb3React } from '@web3-react/core';
import { useCallback, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { basicTokenMap, ChainId } from '../../constants/chains';
import { getAccountBalances, getEthBalance } from '../../store/selectors/token';
import { TokenInfo } from './type';
import { isSameAddress } from '../../utils';

export default function useGetBalance() {
  const { account, chainId } = useWeb3React();
  const accountBalances = useSelector(getAccountBalances);
  const ethBalance = useSelector(getEthBalance);
  const EtherToken = useMemo(
    () => basicTokenMap[(chainId || 1) as ChainId],
    [chainId],
  );
  const getBalance = useCallback(
    (token: TokenInfo) => {
      if (!account || !token) return null;
      if (
        EtherToken &&
        token.symbol === EtherToken.symbol &&
        isSameAddress(token.address, EtherToken.address)
      )
        return !ethBalance || ethBalance?.isNaN() ? null : ethBalance;
      const balance =
        accountBalances[token.address.toLocaleLowerCase()]?.tokenBalances;
      return !balance || balance?.isNaN() ? null : balance;
    },
    [accountBalances, ethBalance, account],
  );

  return getBalance;
}
