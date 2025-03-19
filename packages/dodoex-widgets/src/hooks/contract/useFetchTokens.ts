import { useQueries } from '@tanstack/react-query';
import BigNumber from 'bignumber.js';
import { isEqual } from 'lodash';
import { useEffect, useState } from 'react';
import { BIG_ALLOWANCE } from '../../constants/token';
import { useSolanaConnection } from '../solana/useSolanaConnection';
import { TokenList } from '../Token';

type TokenInfoMap = Map<
  string,
  {
    balance: BigNumber;
    allowance: BigNumber;
  }
>;

export default function useFetchTokens({
  tokenList,
}: {
  tokenList?: TokenList;
}) {
  const [tokenInfoMap, setTokenInfoMap] = useState<TokenInfoMap>(new Map());

  const { fetchTokenBalance } = useSolanaConnection();

  const tokensQueries = useQueries({
    queries:
      tokenList?.map((token) => ({
        queryKey: ['token', 'balance-allowance', token.address],
        queryFn: async () => {
          const result = await fetchTokenBalance(token.address);
          return {
            ...token,
            spender: undefined,
            balance: result.amount,
            allowance: BIG_ALLOWANCE,
          };
        },
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
  }, [tokenInfoMap, tokensQueries.data]);

  return tokenInfoMap;
}
