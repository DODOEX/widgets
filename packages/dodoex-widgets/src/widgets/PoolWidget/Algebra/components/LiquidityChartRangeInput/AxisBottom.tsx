import { Box } from '@dodoex/components';
import {
  NumberValue,
  ScaleLinear,
  axisBottom,
  Axis as d3Axis,
  select,
} from 'd3';
import { useMemo } from 'react';
import { themeColor } from './utils';

const Axis = ({ axisGenerator }: { axisGenerator: d3Axis<NumberValue> }) => {
  const axisRef = (axis: SVGGElement) => {
    axis &&
      select(axis)
        .call(axisGenerator)
        .call((g) => g.select('.domain').remove());
  };

  return <g ref={axisRef} />;
};

export const AxisBottom = ({
  xScale,
  innerHeight,
  offset = 0,
}: {
  xScale: ScaleLinear<number, number>;
  innerHeight: number;
  offset?: number;
}) =>
  useMemo(
    () => (
      <Box
        component="g"
        transform={`translate(0, ${innerHeight + offset})`}
        sx={{
          '& line': {
            display: 'none',
          },
          '& text': {
            color: themeColor.neutral2,
            transform: 'translateY(5px)',
          },
        }}
      >
        <Axis axisGenerator={axisBottom(xScale).ticks(6)} />
      </Box>
    ),
    [innerHeight, offset, xScale],
  );
