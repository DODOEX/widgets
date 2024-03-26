import { useMemo } from 'react';
import { formatShortNumber } from '../../../utils/formatter';
import { BaseMinAndZoomMultiples, computeXPortion } from './helper';

export function useHorizontalLabelPoints({
  chartHeight,
  chartWidth,
  xAxisPoints,
  oneXPx,
  baseMinAndZoomMultiples,
}: {
  chartHeight: number;
  chartWidth: number;
  xAxisPoints: number;
  oneXPx: number;
  baseMinAndZoomMultiples: BaseMinAndZoomMultiples;
}) {
  return useMemo(() => {
    const xPortion = computeXPortion(
      chartWidth,
      baseMinAndZoomMultiples.zoomMultiples,
    );
    const horizontalLabelTickPoints: Array<Array<number>> = [];
    const horizontalLabelTextPoints: Array<{
      x: number;
      y: number;
      text: string;
    }> = [];
    for (let i = 0; i < xAxisPoints; i++) {
      horizontalLabelTickPoints.push([
        i * oneXPx + oneXPx / 2,
        chartHeight,
        i * oneXPx + oneXPx / 2,
        chartHeight + 4,
      ]);

      const power = xPortion
        .multipliedBy(i)
        .multipliedBy(oneXPx)
        .plus(xPortion.multipliedBy(oneXPx / 2))
        .toNumber();
      const axisNum = baseMinAndZoomMultiples.baseMin.multipliedBy(10 ** power);

      const x = i * oneXPx;
      const y = chartHeight + 2 + 4;
      const text = formatShortNumber(axisNum);
      horizontalLabelTextPoints.push({
        x,
        y,
        text,
      });
    }

    return {
      horizontalLabelTickPoints,
      horizontalLabelTextPoints,
    };
  }, [
    baseMinAndZoomMultiples.baseMin,
    baseMinAndZoomMultiples.zoomMultiples,
    chartHeight,
    chartWidth,
    oneXPx,
    xAxisPoints,
  ]);
}
