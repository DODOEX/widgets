import { basicTokenMap, ChainId } from '@dodoex/api';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import BigNumber from 'bignumber.js';
import { isEqualWith } from 'lodash';
import React from 'react';
import { useSelector } from 'react-redux';
import { tokenApi } from '../../constants/api';
import { RootState } from '../../store/reducers';
import { getPopularTokenList, getTokenList } from '../../store/selectors/token';
import useTokenListFetchBalance from './useTokenListFetchBalance';

type TokenResult = NonNullable<
  Awaited<ReturnType<ReturnType<typeof tokenApi.getFetchTokenQuery>['queryFn']>>
>;

export function useHasBalanceTokenList({
  account,
  chainId,
  visible,
}: {
  account: string | undefined;
  chainId: ChainId | undefined;
  visible?: boolean;
}) {
  const queryClient = useQueryClient();
  const [hasBalanceTokenList, setHasBalanceTokenList] = React.useState<
    TokenResult[]
  >([]);
  const [hasTokenLoading, setHasTokenLoading] = React.useState(true);

  const tokenList = useSelector(getTokenList);
  const popularTokenList = useSelector((state: RootState) =>
    getPopularTokenList(chainId ?? 1, state),
  );
  useTokenListFetchBalance({
    chainId: chainId ?? 1,
    tokenList,
    popularTokenList,
    visible: !!chainId && !!visible,
  });

  const basicToken = chainId ? basicTokenMap[chainId] : null;
  useQuery(tokenApi.getFetchTokenQuery(chainId, basicToken?.address, account));

  React.useEffect(() => {
    let time: NodeJS.Timeout;
    const commonKey = tokenApi
      .getFetchTokenQuery(chainId, undefined, account)
      .queryKey.filter((item) => !!item);
    const unSubscribe = queryClient.getQueryCache().subscribe((event) => {
      try {
        const isNotMatch = commonKey.some(
          (key) => !event.query.queryKey.includes(key),
        );
        if (!isNotMatch) {
          clearTimeout(time);
          // 避免频繁调用
          time = setTimeout(() => {
            const tokenQueriesData = queryClient.getQueriesData<TokenResult>({
              queryKey: commonKey,
            });
            let newHasBalanceTokenList = [] as TokenResult[];
            const hasBalanceAddressSet = new Set<string>();
            tokenQueriesData.forEach((value) => {
              const token = value[1];
              if (
                token &&
                token.balance?.gt(0) &&
                !hasBalanceAddressSet.has(token.address)
              ) {
                hasBalanceAddressSet.add(token.address);
                newHasBalanceTokenList.push(token);
              }
            });
            newHasBalanceTokenList = newHasBalanceTokenList.sort((a, b) =>
              a.balance.gt(b.balance) ? -1 : 1,
            );
            if (
              !isEqualWith(
                newHasBalanceTokenList,
                hasBalanceTokenList,
                (newValue, oldValue, key) => {
                  if (key === 'balance' && BigNumber.isBigNumber(newValue)) {
                    return newValue.isEqualTo(oldValue);
                  }
                  return undefined;
                },
              )
            ) {
              setHasBalanceTokenList(newHasBalanceTokenList);
              if (newHasBalanceTokenList.length) {
                setHasTokenLoading(false);
              }
            }
          }, 100);
        }
      } catch (error) {}
    });

    return () => {
      unSubscribe();
      clearTimeout(time);
    };
  }, [queryClient, account, chainId, hasBalanceTokenList]);

  return {
    tokenLoading: hasTokenLoading,
    hasBalanceTokenList,
  };
}
