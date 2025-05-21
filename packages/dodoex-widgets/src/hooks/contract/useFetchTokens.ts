import { useQueries } from '@tanstack/react-query';
import BigNumber from 'bignumber.js';
import { isEqual } from 'lodash';
import { useEffect, useState } from 'react';
import { tokenApi } from '../../constants/api';
import { useWalletInfo } from '../ConnectWallet/useWalletInfo';
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
  skip,
}: {
  tokenList: TokenList;
  blockNumber?: number;
  skip?: boolean;
}) {
  const { getAppKitAccountByChainId } = useWalletInfo();

  const [tokenInfoMap, setTokenInfoMap] = useState<TokenInfoMap>(new Map());

  const tokensQueries = useQueries({
    queries: tokenList.map((token) => {
      const account = getAppKitAccountByChainId(token.chainId);

      const query = tokenApi.getFetchTokenQuery(
        token.chainId,
        token.address,
        account?.appKitAccount.address,
      );

      return {
        queryKey: blockNumber
          ? [...query.queryKey, blockNumber]
          : query.queryKey,
        enabled: query.enabled && !skip,
        queryFn: query.queryFn,
      };
    }),
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

    setTokenInfoMap((prev) => {
      if (isEqual(prev, result)) {
        return prev;
      }
      return result;
    });
  }, [tokensQueries.data]);

  return tokenInfoMap;
}
