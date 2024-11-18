import { Box } from '@dodoex/components';
import { area, curveStepAfter, ScaleLinear } from 'd3';
import { useMemo } from 'react';
import { ChartEntry } from './types';
import { themeColor } from './utils';

export const Area = ({
  series,
  xScale,
  yScale,
  xValue,
  yValue,
  fill,
}: {
  series: ChartEntry[];
  xScale: ScaleLinear<number, number>;
  yScale: ScaleLinear<number, number>;
  xValue: (d: ChartEntry) => number;
  yValue: (d: ChartEntry) => number;
  fill?: string;
}) =>
  useMemo(
    () => (
      <Box
        component="path"
        opacity={0.5}
        stroke={fill ?? themeColor.accent1}
        fill={fill ?? themeColor.accent1}
        d={
          area()
            .curve(curveStepAfter)
            .x((d: unknown) => xScale(xValue(d as ChartEntry)))
            .y1((d: unknown) => yScale(yValue(d as ChartEntry)))
            .y0(yScale(0))(
            series.filter((d) => {
              const value = xScale(xValue(d));
              return value > 0 && value <= window.innerWidth;
            }) as Iterable<[number, number]>,
          ) ?? undefined
        }
      />
    ),
    [fill, series, xScale, xValue, yScale, yValue],
  );
