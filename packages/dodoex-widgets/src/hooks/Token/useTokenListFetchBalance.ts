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
  const autoConnectLoading = useSelector(getAutoConnectLoading);
  const blockNumber = useSelector(getLatestBlockNumber);
  const checkTokens = useMemo(() => {
    if (autoConnectLoading === undefined || autoConnectLoading) {
      return [];
    }
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
  }, [tokenList, popularTokenList, chainId, autoConnectLoading]);

  const selectTokens = useMemo(() => {
    if (!value) return [];
    if (Array.isArray(value)) return value;
    return [value];
  }, [value]);
  const selectChainId = useMemo(() => {
    if (!value) return chainId;
    if (Array.isArray(value)) return value[0]?.chainId ?? chainId;
    return value.chainId;
  }, [value, chainId]);

  const tokenInfoMap = useFetchTokens({
    tokenList: checkTokens,
    chainId,
    skip: visible === false && !defaultLoadBalance,
  });

  useFetchTokens({
    tokenList: selectTokens,
    chainId: selectChainId,
    blockNumber,
  });

  return tokenInfoMap;
}
