import { useMemo } from 'react';
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
  const checkTokenList = useMemo(() => {
    if (autoConnectLoading === undefined || autoConnectLoading) {
      return [];
    }
    const addressSet = new Set<string>();
    const result = [] as TokenList;
    tokenList.forEach((token) => {
      if (token.chainId === chainId) {
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

  const selectTokenAddress = useMemo(() => (value ? [value] : []), [value]);

  useFetchTokens({
    tokenList: checkTokenList,
    skip: visible === false && !defaultLoadBalance,
  });

  useFetchETHBalance(chainId);

  useFetchTokens({
    tokenList: selectTokenAddress,
    blockNumber,
  });
}
