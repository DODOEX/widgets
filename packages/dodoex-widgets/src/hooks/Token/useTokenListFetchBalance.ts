import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { getAutoConnectLoading } from '../../store/selectors/globals';
import { getLatestBlockNumber } from '../../store/selectors/wallet';
import { useFetchTokens } from '../contract';
import { TokenInfo, TokenList } from './type';

export default function useTokenListFetchBalance({
  chainId,
  value,
  tokenList,
  popularTokenList,
  cgTokenList,
  visible,
}: {
  chainId: number;
  value?: TokenInfo | null;
  tokenList: TokenList;
  popularTokenList?: TokenList;
  cgTokenList?: TokenList;
  visible?: boolean;
}) {
  const autoConnectLoading = useSelector(getAutoConnectLoading);
  const blockNumber = useSelector(getLatestBlockNumber);
  const checkTokenAddresses = useMemo(() => {
    if (autoConnectLoading === undefined || autoConnectLoading) {
      return [];
    }
    const addressSet = new Set<string>();
    tokenList.forEach((token) => {
      if (token.chainId === chainId) {
        addressSet.add(token.address);
      }
    });
    popularTokenList?.forEach((token) => {
      if (token.chainId === chainId) {
        addressSet.add(token.address);
      }
    });
    cgTokenList?.forEach((token) => {
      if (token.chainId === chainId) {
        addressSet.add(token.address);
      }
    });
    return Array.from(addressSet);
  }, [tokenList, popularTokenList, cgTokenList, chainId, autoConnectLoading]);

  const selectTokenAddress = useMemo(
    () => (value ? [value.address] : []),
    [value],
  );

  useFetchTokens({
    addresses: checkTokenAddresses,
    chainId,
    skip: visible === false,
  });

  useFetchTokens({
    addresses: selectTokenAddress,
    chainId: value?.chainId ?? chainId,
    blockNumber,
  });
}
