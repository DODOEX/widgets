import { useQuery } from '@tanstack/react-query';
import { useGraphQLRequests } from '../useGraphQLRequests';
import { TokenApi } from '@dodoex/api';
import React from 'react';
import { TokenInfo } from '../Token';

export interface ForecastSlippageListItem {
  forecastSlippage?: number;
  forecastValue?: number;
  confidenceRatio?: number;
  confidenceIntervalUpper?: number;
  confidenceIntervalLower?: number;
}

export function useForecastSlippageList({
  fromToken,
  toToken,
}: {
  fromToken: TokenInfo | undefined | null;
  toToken: TokenInfo | undefined | null;
}) {
  const graphQLRequests = useGraphQLRequests();
  const query = graphQLRequests.getQuery(
    TokenApi.graphql.fetchErc20ForecastSlippage,
    {
      where: {
        aToken: {
          address: fromToken?.address,
          chainId: fromToken?.chainId,
        },
        bToken: {
          address: toToken?.address,
          chainId: toToken?.chainId,
        },
      },
    },
  );
  const fetchQuery = useQuery({
    ...query,
    enabled: !!fromToken && !!toToken,
  });

  const slippageData = React.useMemo(() => {
    if (!fetchQuery.data?.erc20_extend_erc20ExtendV2) return {};
    const { erc20_extend_erc20ExtendV2: data } = fetchQuery.data;
    const slippageList = (
      data.forecastSlippageList?.length
        ? [...data.forecastSlippageList]
            ?.map((item) => ({
              ...item,
              confidenceRatio: item?.confidenceRatio
                ? Number(item.confidenceRatio)
                : 0,
            }))
            .sort((a, b) => a?.confidenceRatio - b?.confidenceRatio)
        : []
    ) as ForecastSlippageListItem[];
    // Take the one with the highest probability as the recommended slippage
    const recommendSlippage = slippageList.length
      ? slippageList[slippageList.length - 1]
      : undefined;
    return {
      recommendSlippage,
      slippageList,
    };
  }, [fetchQuery.data]);

  return {
    slippageData,
    ...fetchQuery,
  };
}
