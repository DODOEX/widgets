import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { getTokenList } from '../../store/selectors/token';
import { useWalletState } from '../ConnectWallet/useWalletState';

export default function useFindTokenByAddress(address?: string) {
  const tokenList = useSelector(getTokenList);
  const { chainId } = useWalletState();

  const token = useMemo(() => {
    if (!address) return undefined;
    let res = tokenList.find(
      ({ address: tokenAddress, chainId: tokenChainId }) =>
        tokenChainId === chainId && tokenAddress === address,
    );
    if (!res) {
      res = tokenList.find(
        ({ address: tokenAddress }) => tokenAddress === address,
      );
    }
    return res;
  }, [address, tokenList, chainId]);

  return token;
}
