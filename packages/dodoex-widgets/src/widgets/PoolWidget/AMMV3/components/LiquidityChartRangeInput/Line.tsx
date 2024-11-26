import { Box } from '@dodoex/components';
import { ScaleLinear } from 'd3';
import { useMemo } from 'react';
import { themeColor } from './utils';

export const Line = ({
  value,
  xScale,
  innerHeight,
}: {
  value: number;
  xScale: ScaleLinear<number, number>;
  innerHeight: number;
}) =>
  useMemo(
    () => (
      <Box
        component="line"
        x1={xScale(value)}
        y1="0"
        x2={xScale(value)}
        y2={innerHeight}
        sx={{
          opacity: 0.5,
          strokeWidth: 2,
          stroke: themeColor.neutral1,
          fill: 'none',
        }}
      />
    ),
    [value, xScale, innerHeight],
  );
