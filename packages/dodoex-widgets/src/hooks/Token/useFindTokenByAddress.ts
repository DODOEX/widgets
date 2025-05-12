import { useWeb3React } from '@web3-react/core';
import { useMemo } from 'react';
import { useTokenState } from '../useTokenState';

export default function useFindTokenByAddress(address?: string) {
  const { chainId } = useWeb3React();
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
