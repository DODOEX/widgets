import { useMemo } from 'react';
import { useFetchTokens } from '../contract';
import { useGlobalState } from '../useGlobalState';
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
  value?: TokenInfo | null | Array<TokenInfo>;
  tokenList: TokenList;
  popularTokenList?: TokenList;
  visible?: boolean;
  defaultLoadBalance?: boolean;
}) {
  const { latestBlockNumber: blockNumber } = useGlobalState();

  const checkTokenList = useMemo(() => {
    const addressSet = new Set<TokenInfo>();
    tokenList.forEach((token) => {
      if (token.chainId === chainId) {
        addressSet.add(token);
      }
    });
    popularTokenList?.forEach((token) => {
      if (token.chainId === chainId) {
        addressSet.add(token);
      }
    });
    return Array.from(addressSet);
  }, [tokenList, popularTokenList, chainId]);

  const selectTokenList = useMemo(() => {
    if (!value) return [];
    if (Array.isArray(value)) return value.map((item) => item);
    return [value];
  }, [value]);

  const tokenInfoMap = useFetchTokens({
    tokenList: checkTokenList,
    skip: visible === false && !defaultLoadBalance,
  });

  useFetchTokens({
    tokenList: selectTokenList,
    blockNumber,
  });

  return tokenInfoMap;
}
