import { useQueries } from '@tanstack/react-query';
import BigNumber from 'bignumber.js';
import { useEffect, useMemo, useState } from 'react';
import { tokenApi } from '../../../../constants/api';
import { TokenInfo } from '../../../../hooks/Token';

export const usePoolTokenBalance = (
  poolAddress: string,
  baseToken?: TokenInfo,
  quoteToken?: TokenInfo,
) => {
  const [tokenReserves, setTokenReserves] = useState<BigNumber[] | undefined>();

  const tokenList = useMemo(() => {
    const tokens = [baseToken];
    if (quoteToken) {
      tokens.push(quoteToken);
    }
    return tokens;
  }, [baseToken, quoteToken]);

  const tokensQueries = useQueries({
    queries: tokenList.map((t) => {
      const query = tokenApi.getFetchTokenQuery(
        t?.chainId,
        t?.address,
        poolAddress,
      );

      return {
        queryKey: query.queryKey,
        enabled: query.enabled && !t?.chainId && !t?.address && !poolAddress,
        queryFn: query.queryFn,
      };
    }),
    combine: (results) => {
      return {
        data: results.map((result) => result.data?.balance),
        pending: results.some((result) => result.isPending),
      };
    },
  });

  useEffect(() => {
    const result: BigNumber[] = [];
    tokensQueries.data.forEach((data) => {
      if (data) {
        result.push(data);
      }
    });
    if (result.length) {
      setTokenReserves(result);
    }
  }, [tokensQueries.data]);

  return {
    loading: tokensQueries.pending,
    reserves: tokenReserves,
  };
};
