import { useMemo } from 'react';

export function useGridLinePoints({
  chartHeight,
  chartWidth,
  horizontalLineCount,
  verticalLineCount,
}: {
  chartHeight: number;
  chartWidth: number;
  horizontalLineCount: number;
  verticalLineCount: number;
}) {
  return useMemo(() => {
    const horizontalGridLines: Array<Array<number>> = [];
    const horizontalGridPerBlockHeight =
      chartHeight / (horizontalLineCount + 1);
    const verticalGridLines: Array<Array<number>> = [];
    const verticalGridPerBlockWidth = chartWidth / verticalLineCount;
    for (let index = 0; index < horizontalLineCount; index++) {
      const y = horizontalGridPerBlockHeight * (index + 1);
      horizontalGridLines.push([0, y, chartWidth, y]);
    }
    for (let index = 0; index < verticalLineCount; index++) {
      const x =
        verticalGridPerBlockWidth * index + verticalGridPerBlockWidth / 2;
      verticalGridLines.push([x, 0, x, chartHeight]);
    }
    return {
      horizontalGridLines,
      verticalGridLines,
    };
  }, [chartHeight, chartWidth, horizontalLineCount, verticalLineCount]);
}
