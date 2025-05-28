import BigNumber from 'bignumber.js';
import React from 'react';
import { formatPercentageNumber } from '../utils/formatter';

export type MidPathType = {
  fromToken: string;
  toToken: string;
  chainId: number;
  poolDetails: Map<
    string,
    {
      poolPart: string;
      poolAddress: string | null;
    }[]
  >;
};

export interface RouteDataType {
  subRouteTotalPart: number;
  subRoute: Array<{
    midPathPart: number;
    midPath: Array<{
      fromToken: string;
      toToken: string;
      oneSplitTotalPart: number;
      poolDetails: Array<{
        poolName: string;
        pool: string;
        poolPart: number;
      }>;
    }>;
  }>;
}

export function useRouteVisionData({
  rawRouteData,
  chainId,
}: {
  rawRouteData: string;
  chainId: number;
}) {
  const routeData = React.useMemo<MidPathType[]>(() => {
    if (!rawRouteData) {
      return [];
    }

    try {
      const routeDataRaw: RouteDataType = JSON.parse(rawRouteData);
      const midPath = routeDataRaw.subRoute[0].midPath;
      return midPath.map((path) => {
        const { fromToken, toToken, oneSplitTotalPart } = path;
        const poolDetails: MidPathType['poolDetails'] = new Map();
        path.poolDetails.forEach((pool) => {
          const poolDetail = {
            poolPart: formatPercentageNumber({
              input: new BigNumber(pool.poolPart).div(oneSplitTotalPart),
            }),
            poolAddress: pool.pool || null,
          };
          if (poolDetails.has(pool.poolName)) {
            poolDetails.get(pool.poolName)?.push(poolDetail);
            return;
          }
          poolDetails.set(pool.poolName, [poolDetail]);
        });
        return {
          fromToken,
          toToken,
          chainId,
          poolDetails,
        };
      });
    } catch (e) {
      console.error(e);
    }

    return [];
  }, [chainId, rawRouteData]);

  return {
    routeData,
  };
}
