import {
  getFetchVE33NonfungiblePositionManagerBalanceOfQueryOptions,
  getFetchVE33NonfungiblePositionManagerTokenOfOwnerByIndexQueryOptions,
  getFetchVE33NonfungiblePositionManagerPositionsQueryOptions,
  getFetchVE33V3PairSlot0QueryOptions,
  getFetchVE33V3GaugeStakedValuesQueryOptions,
} from '@dodoex/dodo-contract-request';
import { useQueries, useQuery } from '@tanstack/react-query';
import { increaseArray } from '../../../utils/utils';
import { PoolTypeE, Ve33PoolInfoI } from '../types';
import React from 'react';
import {
  getPositionAmount0,
  getPositionAmount1,
} from '../Ve33V3PoolOperate/utils/getPositionAmount';
import BigNumber from 'bignumber.js';

export function useVe33V3Positions({
  poolInfo,
  account,
}: {
  poolInfo?: Ve33PoolInfoI;
  account?: string;
}) {
  const isV3 = poolInfo?.type === PoolTypeE.CLPool;
  const fetchBalance = useQuery({
    ...getFetchVE33NonfungiblePositionManagerBalanceOfQueryOptions(
      isV3 ? poolInfo?.chainId : undefined,
      account,
    ),
    refetchOnMount: false,
  });
  const fetchTokenIds = useQueries({
    queries: (fetchBalance.data
      ? increaseArray(Number(fetchBalance.data))
      : []
    ).map((_, i) => {
      return getFetchVE33NonfungiblePositionManagerTokenOfOwnerByIndexQueryOptions(
        poolInfo?.chainId,
        account,
        i,
      );
    }),
  });
  const fetchStakedValues = useQuery({
    ...getFetchVE33V3GaugeStakedValuesQueryOptions(
      isV3 ? poolInfo?.chainId : undefined,
      poolInfo?.gaugeAddress,
      account,
    ),
    refetchOnMount: false,
  });
  const tokenIds = React.useMemo(() => {
    const result = fetchStakedValues.data?.map((id) => Number(id)) ?? [];
    fetchTokenIds.forEach((tokenIdQuery) => {
      const id = Number(tokenIdQuery.data);
      if (tokenIdQuery.data !== undefined && !result.includes(id)) {
        result.push(id);
      }
    });
    return result;
  }, [fetchTokenIds, fetchStakedValues.data]);

  const fetchPositions = useQueries({
    queries: tokenIds.map((tokenId) => {
      return getFetchVE33NonfungiblePositionManagerPositionsQueryOptions(
        poolInfo?.chainId,
        tokenId,
      );
    }),
  });

  const fetchGlobalState = useQuery(
    getFetchVE33V3PairSlot0QueryOptions(poolInfo?.chainId, poolInfo?.id),
  );

  const positionsQuery = React.useMemo(() => {
    return fetchPositions.map((positionQuery, i) => {
      const tokenId = tokenIds[i];
      const position = convertPositionData(positionQuery.data);
      const tickCurrent = Number(fetchGlobalState.data?.tick);
      const amount0 =
        position && tickCurrent
          ? getPositionAmount0({
              tickCurrent,
              tickLower: Number(position?.tickLower),
              tickUpper: Number(position?.tickUpper),
              liquidity: position?.liquidity?.toString() || '0',
              roundUp: false,
              sqrtRatioX96: fetchGlobalState.data?.sqrtPriceX96,
            })
          : null;
      const amount1 =
        position && tickCurrent
          ? getPositionAmount1({
              tickCurrent,
              tickLower: Number(position?.tickLower),
              tickUpper: Number(position?.tickUpper),
              liquidity: position?.liquidity?.toString() || '0',
              roundUp: false,
              sqrtRatioX96: fetchGlobalState.data?.sqrtPriceX96,
            })
          : null;
      return {
        isLoading: positionQuery.isLoading || fetchGlobalState.isLoading,
        refetch: positionQuery.refetch,
        errorRefetch:
          positionQuery.isError || fetchGlobalState.isError
            ? () => {
                if (positionQuery.isError) {
                  positionQuery.refetch();
                }
                if (fetchGlobalState.isError) {
                  fetchGlobalState.refetch();
                }
              }
            : undefined,
        data:
          position && amount0 && amount1 && poolInfo
            ? {
                ...position,
                tokenId,
                amount0: new BigNumber(amount0.toString())
                  .div(10 ** poolInfo.baseToken.decimals)
                  .toNumber(),
                amount1: new BigNumber(amount1.toString())
                  .div(10 ** poolInfo.quoteToken.decimals)
                  .toNumber(),
                tickCurrent,
              }
            : null,
      };
    });
  }, [tokenIds, fetchPositions, fetchGlobalState, poolInfo]);

  return {
    positionsQuery,
    fetchBalance,
    fetchPositions,
    fetchGlobalState,
    fetchStakedValues,
  };
}

export function convertPositionData(
  data:
    | Awaited<
        ReturnType<
          ReturnType<
            typeof getFetchVE33NonfungiblePositionManagerPositionsQueryOptions
          >['queryFn']
        >
      >
    | undefined,
) {
  return data
    ? {
        feeGrowthInside0LastX128: data.feeGrowthInside0LastX128,
        feeGrowthInside1LastX128: data.feeGrowthInside1LastX128,
        liquidity: data.liquidity,
        nonce: data.nonce,
        operator: data.operator,
        tickLower: data.tickLower,
        tickUpper: data.tickUpper,
        token0: data.token0,
        token1: data.token1,
        tokensOwed0: data.tokensOwed0,
        tokensOwed1: data.tokensOwed1,
      }
    : null;
}
