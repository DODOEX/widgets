import { useQueries } from '@tanstack/react-query';
import { useWeb3React } from '@web3-react/core';
import BigNumber from 'bignumber.js';
import { isEqual } from 'lodash';
import { useEffect, useMemo, useState } from 'react';
import { tokenApi } from '../../constants/api';
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
  addresses: addressesProps,
  blockNumber,
  chainId,
  skip,
}: {
  tokenList?: TokenList;
  addresses?: string[];
  blockNumber?: number;
  chainId?: number;
  skip?: boolean;
}) {
  const { account } = useWeb3React();
  const [tokenInfoMap, setTokenInfoMap] = useState<TokenInfoMap>(new Map());

  const addresses = useMemo(() => {
    return [
      ...(tokenList?.map((token) => token.address) || []),
      ...(addressesProps || []),
    ].map((address) => address);
  }, [tokenList, JSON.stringify(addressesProps)]);

  const tokensQueries = useQueries({
    queries: addresses.map((address) => {
      const query = tokenApi.getFetchTokenQuery(chainId, address, account);

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
    if (!isEqual(result, tokenInfoMap)) {
      setTokenInfoMap(result);
    }
  }, [JSON.stringify(tokensQueries.data)]);

  return tokenInfoMap;
}
