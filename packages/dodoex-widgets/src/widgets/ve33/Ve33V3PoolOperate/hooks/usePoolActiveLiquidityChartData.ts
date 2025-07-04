import JSBI from 'jsbi';
import { useMemo } from 'react';
import computeSurroundingTicks from '../utils/computeSurroundingTicks';
import { TokenInfo } from '../../../../hooks/Token';
import { tickToPrice } from '../utils/getTickToPrice';
import React from 'react';
import { ChartEntry } from '../components/LiquidityChartRangeInput/types';
import { Price } from '../../../../utils/fractions';

const PRICE_FIXED_DIGITS = 8;

// Tick with fields parsed to JSBIs, and active liquidity computed.
export interface TickProcessed {
  tick: number;
  liquidityActive: JSBI;
  liquidityNet: JSBI;
  price0: string;
  sdkPrice: Price;
}

export interface FetchTicks {
  ticks:
    | Array<{
        id: string;
        liquidityNet: string;
        poolAddress?: string;
        price0: string;
        price1: string;
        tickIdx: string;
      }>
    | undefined
    | null;
  isLoading: boolean;
  isError: boolean;
  refetch: () => void;
}

export function usePoolActiveLiquidityChartData({
  tickCurrent,
  liquidity,
  fetchTicks,
  token0,
  token1,
}: {
  tickCurrent: number | undefined;
  liquidity: string | undefined;
  fetchTicks?: FetchTicks;
  token0: TokenInfo | undefined;
  token1: TokenInfo | undefined;
}) {
  const data = useMemo(() => {
    // Find nearest valid tick for pool in case tick is not initialized.
    const activeTick = tickCurrent;
    if (
      !token0 ||
      !token1 ||
      activeTick === undefined ||
      !fetchTicks?.ticks?.length ||
      fetchTicks.isLoading
    ) {
      return undefined;
    }
    const ticks = fetchTicks.ticks;

    // find where the active tick would be to partition the array
    // if the active tick is initialized, the pivot will be an element
    // if not, take the previous tick as pivot
    const pivot =
      ticks.findIndex(
        (tickData) =>
          tickData?.tickIdx && Number(tickData.tickIdx) > activeTick,
      ) - 1;

    if (pivot < 0) {
      // consider setting a local error
      console.log(
        'usePoolTickData',
        'usePoolActiveLiquidity',
        'TickData pivot not found',
        {
          token0: token0.address,
          token1: token1.address,
          chainId: token0.chainId,
        },
      );
      return undefined;
    }

    const sdkPrice = tickToPrice(token0, token1, activeTick);
    const activeTickProcessed: TickProcessed = {
      liquidityActive: JSBI.BigInt(liquidity ?? 0),
      tick: activeTick,
      liquidityNet:
        Number(ticks[pivot]?.tickIdx) === activeTick
          ? JSBI.BigInt(ticks[pivot]?.liquidityNet ?? 0)
          : JSBI.BigInt(0),
      price0: sdkPrice.toFixed(PRICE_FIXED_DIGITS),
      sdkPrice,
    };

    const subsequentTicks = computeSurroundingTicks(
      token0,
      token1,
      activeTickProcessed,
      ticks,
      pivot,
      true,
    );

    const previousTicks = computeSurroundingTicks(
      token0,
      token1,
      activeTickProcessed,
      ticks,
      pivot,
      false,
    );

    const ticksProcessed = previousTicks
      .concat(activeTickProcessed)
      .concat(subsequentTicks);

    return ticksProcessed;
  }, [fetchTicks, tickCurrent, liquidity, token0, token1]);

  const formatData = React.useCallback(() => {
    if (!data?.length) {
      return undefined;
    }

    const newData: ChartEntry[] = [];

    for (let i = 0; i < data.length; i++) {
      const t: TickProcessed = data[i];

      const chartEntry = {
        activeLiquidity: parseFloat(t.liquidityActive.toString()),
        price0: parseFloat(t.price0),
      };

      if (chartEntry.activeLiquidity > 0) {
        newData.push(chartEntry);
      }
    }

    return newData;
  }, [data]);

  return {
    hidden: !fetchTicks,
    isLoading: !!fetchTicks?.isLoading,
    error: !!fetchTicks?.isError,
    data,
    formattedData: !fetchTicks?.isLoading ? formatData() : undefined,
  };
}
