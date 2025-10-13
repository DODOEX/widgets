import { useQueries } from '@tanstack/react-query';
import { useUserOptions } from '../../../components/UserOptionsProvider';
import { FetchMyLiquidityListLqList, poolApi } from '../utils';
import { ChainId, PoolType } from '@dodoex/api';
import React from 'react';
import BigNumber from 'bignumber.js';

export function usePoolListMyLiquidity({
  account,
  lqList,
}: {
  account?: string;
  lqList: FetchMyLiquidityListLqList;
}) {
  const { onlyChainId } = useUserOptions();
  const needRealtimeBalance = React.useMemo(() => {
    return onlyChainId === ChainId.PHAROS_TESTNET;
  }, [onlyChainId]);
  const queryLqList = !needRealtimeBalance ? [] : (lqList ?? []);
  const totalBaseLpQueries = useQueries({
    queries: queryLqList.map((item) => {
      return poolApi.getTotalBaseLpQuery(
        item?.pair?.chainId,
        // Only AMMV2 needs to query poolTokenPercentage
        item?.pair?.type === 'AMMV2' ? item?.pair?.id : undefined,
        item?.pair?.type as PoolType | undefined,
        Number(item?.pair?.baseLpToken?.decimals),
      );
    }),
    combine(result) {
      const data = queryLqList.reduce(
        (acc, cur, curIndex) => {
          const key = cur?.pair?.id;
          const data = result[curIndex].data;
          if (key && data) {
            acc[key] = data;
          }
          return acc;
        },
        {} as {
          [key: string]: BigNumber;
        },
      );
      return {
        data,
        isLoading: result.some((item) => item.isLoading),
      };
    },
  });
  const userBaseLpQueries = useQueries({
    queries: queryLqList.map((item) => {
      return poolApi.getUserBaseLpQuery(
        item?.pair?.chainId,
        item?.pair?.id,
        item?.pair?.type as PoolType | undefined,
        Number(item?.pair?.baseLpToken?.decimals),
        account,
      );
    }),
    combine(result) {
      const data = queryLqList.reduce(
        (acc, cur, curIndex) => {
          const key = cur?.pair?.id;
          const data = result[curIndex]?.data;
          if (key && data) {
            acc[key] = data;
          }
          return acc;
        },
        {} as {
          [key: string]: BigNumber;
        },
      );
      return {
        data,
        isLoading: result.some((item) => item.isLoading),
      };
    },
  });
  const userQuoteLpQueries = useQueries({
    queries: queryLqList.map((item) => {
      return poolApi.getUserQuoteLpQuery(
        item?.pair?.chainId,
        item?.pair?.id,
        item?.pair?.type as PoolType | undefined,
        Number(item?.pair?.quoteLpToken?.decimals),
        account,
      );
    }),
    combine(result) {
      const data = queryLqList.reduce(
        (acc, cur, curIndex) => {
          const key = cur?.pair?.id;
          const data = result[curIndex]?.data;
          if (key && data) {
            acc[key] = data;
          }
          return acc;
        },
        {} as {
          [key: string]: BigNumber;
        },
      );
      return {
        data,
        isLoading: result.some((item) => item.isLoading),
      };
    },
  });
  const reserveQueryLqList = queryLqList?.filter(
    (item) => item?.pair?.type === 'DPP',
  );
  const reserveQueries = useQueries({
    queries:
      reserveQueryLqList?.map((item) => {
        return poolApi.getReserveLpQuery(
          item?.pair?.chainId,
          item?.pair?.id,
          item?.pair?.type as PoolType | undefined,
          Number(item?.pair?.baseLpToken?.decimals),
          Number(item?.pair?.quoteLpToken?.decimals),
        );
      }) ?? [],
    combine(result) {
      const data = reserveQueryLqList.reduce(
        (acc, cur, curIndex) => {
          const key = cur?.pair?.id;
          const data = result[curIndex]?.data;
          if (key && data) {
            acc[key] = data;
          }
          return acc;
        },
        {} as {
          [key: string]: {
            baseReserve: BigNumber;
            quoteReserve: BigNumber;
          };
        },
      );
      return {
        data,
        isLoading: result.some((item) => item.isLoading),
      };
    },
  });

  const userLpBalanceMap = React.useMemo(() => {
    const result = new Map<
      string,
      {
        userBaseLpBalance?: BigNumber;
        userQuoteLpBalance?: BigNumber;
        poolTokenPercentage?: BigNumber;
      }
    >();
    Object.entries(userBaseLpQueries.data).forEach(
      ([key, userBaseLpBalance]) => {
        if (userBaseLpBalance) {
          const item = result.get(key) || {};
          item.userBaseLpBalance = userBaseLpBalance;
          result.set(key, item);
        }
      },
    );
    Object.entries(userQuoteLpQueries.data).forEach(
      ([key, userQuoteLpBalance]) => {
        if (userQuoteLpBalance) {
          const item = result.get(key) || {};
          item.userQuoteLpBalance = userQuoteLpBalance;
          result.set(key, item);
        }
      },
    );
    Object.entries(reserveQueries.data).forEach(([key, reserve]) => {
      if (reserve) {
        const item = result.get(key) || {};
        item.userBaseLpBalance = reserve.baseReserve;
        item.userQuoteLpBalance = reserve.quoteReserve;
        result.set(key, item);
      }
    });
    Object.entries(totalBaseLpQueries.data).forEach(([key, totalLp]) => {
      if (totalLp) {
        const item = result.get(key) || {};
        if (item.userBaseLpBalance) {
          item.poolTokenPercentage = item.userBaseLpBalance.div(totalLp);
        }
        result.set(key, item);
      }
    });
    return result;
  }, [
    userBaseLpQueries.data,
    userQuoteLpQueries.data,
    reserveQueries.data,
    totalBaseLpQueries.data,
  ]);

  const isLpLoading =
    userBaseLpQueries.isLoading ||
    userQuoteLpQueries.isLoading ||
    reserveQueries.isLoading ||
    totalBaseLpQueries.isLoading;

  return {
    needRealtimeBalance,
    userLpBalanceMap,
    isLpLoading,
    isPoolShareLoading: totalBaseLpQueries.isLoading || isLpLoading,
  };
}
