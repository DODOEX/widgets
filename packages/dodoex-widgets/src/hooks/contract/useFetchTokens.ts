import { useQueries } from '@tanstack/react-query';
import BigNumber from 'bignumber.js';
import { isEqual } from 'lodash';
import { useEffect, useMemo, useState } from 'react';
import { tokenApi } from '../../constants/api';
import { TokenList } from '../Token';
import { useWalletInfo } from '../ConnectWallet/useWalletInfo';
import { CONTRACT_QUERY_KEY } from '@dodoex/api';
import { useSolanaConnection } from '../solana/useSolanaConnection';
import { BIG_ALLOWANCE } from '../../constants/token';

type TokenInfoMap = Map<
  string,
  {
    balance: BigNumber;
    allowance: BigNumber;
  }
>;

export default function useFetchTokens({
  tokenList,
  blockNumber,
  chainId,
  skip,
}: {
  tokenList?: TokenList;
  blockNumber?: number;
  chainId?: number;
  skip?: boolean;
}) {
  const { account, isSolana } = useWalletInfo();
  const [tokenInfoMap, setTokenInfoMap] = useState<TokenInfoMap>(new Map());

  const { fetchTokenBalance } = useSolanaConnection();
  const tokensQueries = useQueries({
    queries:
      (isSolana
        ? tokenList?.map((token) => ({
            queryKey: [
              CONTRACT_QUERY_KEY,
              'token',
              'getFetchTokenQuery',
              chainId,
              account?.toLocaleLowerCase(),
              undefined,
              token.address,
            ],
            queryFn: (async () => {
              const result = await fetchTokenBalance(token.address);
              return {
                ...token,
                spender: undefined,
                balance: result.amount,
                allowance: BIG_ALLOWANCE,
              };
            }) as ReturnType<typeof tokenApi.getFetchTokenQuery>['queryFn'],
          }))
        : tokenList?.map((token) => {
            const query = tokenApi.getFetchTokenQuery(
              token.chainId || chainId,
              token.address,
              account,
            );

            return {
              queryKey: blockNumber
                ? [...query.queryKey, blockNumber]
                : query.queryKey,
              enabled: query.enabled && !skip,
              queryFn: query.queryFn,
            };
          })) ?? [],
    combine: (results) => {
      return {
        data: results.map((result) => result.data),
        pending: results.some((result) => result.isPending),
      };
    },
  });

  useEffect(() => {
    const result = new Map() as TokenInfoMap;
    tokensQueries.data.forEach((data) => {
      if (data) {
        result.set(`${data.chainId}-${data.address}`, data);
      }
    });
    if (!isEqual(result, tokenInfoMap)) {
      setTokenInfoMap(result);
    }
  }, [JSON.stringify(tokensQueries.data)]);

  return tokenInfoMap;
}
