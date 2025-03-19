import { useMemo } from 'react';
import { useFetchTokens } from '../contract';
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
  const checkTokens = useMemo(() => {
    const addressSet = new Set<string>();
    const result = [] as TokenInfo[];
    tokenList.forEach((token) => {
      if (token.chainId === chainId && !addressSet.has(token.address)) {
        addressSet.add(token.address);
        result.push(token);
      }
    });
    popularTokenList?.forEach((token) => {
      if (token.chainId === chainId && !addressSet.has(token.address)) {
        addressSet.add(token.address);
        result.push(token);
      }
    });
    return result;
  }, [tokenList, popularTokenList, chainId]);

  const tokenInfoMap = useFetchTokens({
    tokenList: checkTokens,
  });

  return tokenInfoMap;
}
