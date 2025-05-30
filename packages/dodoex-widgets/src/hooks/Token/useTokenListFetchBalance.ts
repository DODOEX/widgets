import { useMemo } from 'react';
import { useFetchTokens } from '../contract';
import { TokenInfo, TokenList } from './type';
import { useGlobalState } from '../useGlobalState';

export default function useTokenListFetchBalance({
  chainId,
  value,
  tokenList,
  popularTokenList,
  visible,
  defaultLoadBalance,
}: {
  chainId: number;
  value?: TokenInfo | null | Array<TokenInfo>;
  tokenList: TokenList;
  popularTokenList?: TokenList;
  visible?: boolean;
  defaultLoadBalance?: boolean;
}) {
  const { latestBlockNumber: blockNumber, autoConnectLoading } =
    useGlobalState();
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

  const selectTokenAddress = useMemo(() => {
    if (!value) return [];
    if (Array.isArray(value)) return value.map((item) => item.address);
    return [value.address];
  }, [value]);
  const selectChainId = useMemo(() => {
    if (!value) return chainId;
    if (Array.isArray(value)) return value[0]?.chainId ?? chainId;
    return value.chainId;
  }, [value, chainId]);

  const tokenInfoMap = useFetchTokens({
    addresses: checkTokenAddresses,
    chainId,
    skip: visible === false && !defaultLoadBalance,
  });

  useFetchTokens({
    addresses: selectTokenAddress,
    chainId: selectChainId,
    blockNumber,
  });

  return tokenInfoMap;
}
