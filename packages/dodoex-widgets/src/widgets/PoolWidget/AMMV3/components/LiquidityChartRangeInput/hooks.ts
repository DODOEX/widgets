import { useCallback, useMemo } from 'react';
import { TokenInfo } from '../../../../../hooks/Token/type';
import {
  TickProcessed,
  usePoolActiveLiquidity,
} from '../../hooks/usePoolTickData';
import { FeeAmount } from '../../sdks/v3-sdk/constants';
import { ChartEntry } from './types';

export function useDensityChartData({
  mint1,
  mint2,
  feeAmount,
}: {
  mint1: Maybe<TokenInfo>;
  mint2: Maybe<TokenInfo>;
  feeAmount?: FeeAmount;
}) {
  const { isLoading, error, data } = usePoolActiveLiquidity(
    mint1,
    mint2,
    feeAmount,
  );

  const formatData = useCallback(() => {
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

  return useMemo(() => {
    return {
      isLoading,
      error,
      formattedData: !isLoading ? formatData() : undefined,
    };
  }, [isLoading, error, formatData]);
}
