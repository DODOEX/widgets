import { useMemo } from 'react';
import { useWalletInfo } from '../ConnectWallet/useWalletInfo';
import { useTokenState } from '../useTokenState';

export default function useFindTokenByAddress(address?: string) {
  const { chainId } = useWalletInfo();
  const { tokenList } = useTokenState();

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
