import { useQueries } from '@tanstack/react-query';
import BigNumber from 'bignumber.js';
import { isEqual } from 'lodash';
import { useEffect, useState } from 'react';
import { tokenApi } from '../../constants/api';
import { BIG_ALLOWANCE } from '../../constants/token';
import { useWalletInfo } from '../ConnectWallet/useWalletInfo';
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
  blockNumber,
  chainId,
  skip,
}: {
  tokenList?: TokenList;
  blockNumber?: number;
  chainId?: number;
  skip?: boolean;
}) {
  const { account } = useWalletInfo();
  const [tokenInfoMap, setTokenInfoMap] = useState<TokenInfoMap>(new Map());

  const { fetchTokenBalance } = useSolanaConnection();
  const tokensQueries = useQueries({
    queries:
      tokenList?.map((token) => ({
        queryKey: [
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
