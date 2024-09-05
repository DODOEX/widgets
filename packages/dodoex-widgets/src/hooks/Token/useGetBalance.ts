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
import { useWalletState } from '../ConnectWallet/useWalletState';

export default function useGetBalance() {
  const { chainId, evmAccount, tonAccount } = useWalletState();
  const accountBalances = useSelector(getAccountBalances);
  const ethBalance = useSelector(getEthBalance);
  const getBalance = useCallback(
    (token: TokenInfo) => {
      const tokenChainId = token.chainId ?? chainId ?? 1;
      const account = tokenChainId === ChainId.TON ? tonAccount : evmAccount;
      if (!account || !token) return null;
      // cross-chain basic token
      if (isSameAddress(token.address, etherTokenAddress)) {
        const currentChainIdEthBalance = ethBalance[tokenChainId];
        return !currentChainIdEthBalance || currentChainIdEthBalance?.isNaN()
          ? null
          : currentChainIdEthBalance;
      }
      const balance =
        accountBalances[token.address.toLocaleLowerCase()]?.tokenBalances;
      return !balance || balance?.isNaN() ? null : balance;
    },
    [accountBalances, ethBalance, evmAccount, tonAccount],
  );

  return getBalance;
}
