import { useEffect, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { getAutoConnectLoading } from '../../store/selectors/globals';
import { getLatestBlockNumber } from '../../store/selectors/wallet';
import { useFetchETHBalance, useFetchTokens } from '../contract';
import { TokenInfo, TokenList } from './type';

export default function useTokenListFetchBalance({
  chainId,
  value,
  tokenList,
  popularTokenList,
  visible,
  defaultLoadBalance,
}: {
  chainId: number;
  value?: TokenInfo | null;
  tokenList: TokenList;
  popularTokenList?: TokenList;
  visible?: boolean;
  defaultLoadBalance?: boolean;
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
    return Array.from(addressSet);
  }, [tokenList, popularTokenList, chainId, autoConnectLoading]);

  const selectTokenAddress = useMemo(
    () => (value ? [value.address] : []),
    [value],
  );
  const selectChainId = useMemo(
    () => value?.chainId ?? chainId,
    [value?.chainId, chainId],
  );

  useFetchTokens({
    addresses: checkTokenAddresses,
    chainId,
    skip: visible === false && !defaultLoadBalance,
  });

  useFetchETHBalance(chainId);

  useFetchTokens({
    addresses: selectTokenAddress,
    chainId: selectChainId,
    blockNumber,
  });
}
