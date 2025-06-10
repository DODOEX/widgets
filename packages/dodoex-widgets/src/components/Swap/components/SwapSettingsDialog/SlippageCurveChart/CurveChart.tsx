import { Box, Skeleton, useTheme } from '@dodoex/components';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  ResponsiveContainer,
  ReferenceDot,
} from 'recharts';
import React from 'react';
import { ForecastSlippageListItem } from '../../../../../hooks/Swap/useForecastSlippageList';
import { formatPercentageNumber } from '../../../../../utils/formatter';

export const dotClassName = 'position-y-dot';

function LoadingLineChart() {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
      }}
    >
      <Skeleton width="100%" height={12} />
      <Skeleton width="100%" height={12} />
    </Box>
  );
}

function CurveChart({
  data,
  loading,
}: {
  data: ForecastSlippageListItem[];
  loading?: boolean;
}) {
  const theme = useTheme();
  const mainColor = theme.palette.primary.main;
  const wrapperRef = React.useRef<HTMLDivElement>(null);

  const dataLen = data.length;
  return (
    <Box
      sx={{
        height: 105,
        flex: 1,
        [`& .${dotClassName}`]: {
          visibility: 'hidden',
        },
      }}
      ref={wrapperRef}
    >
      {loading ? (
        <LoadingLineChart />
      ) : (
        <Box
          component={ResponsiveContainer}
          sx={{
            typography: 'h6',
            '& .recharts-cartesian-axis text': {
              fill: theme.palette.background.paperContrast,
            },
          }}
        >
          <AreaChart
            data={data}
            margin={{
              top: 0,
              right: 0,
              left: 0,
              bottom: 0,
            }}
          >
            <XAxis
              dataKey="forecastSlippage"
              axisLine={false}
              tickLine={false}
              interval="preserveStartEnd"
              tickFormatter={(props) => {
                const value = formatPercentageNumber({ input: props });
                return value;
              }}
              type="number"
              domain={[
                dataLen ? (data[0].forecastSlippage ?? 0) : 0,
                dataLen
                  ? (data[dataLen - 1].forecastSlippage ?? 'auto')
                  : 'auto',
              ]}
            />
            <YAxis
              dataKey="confidenceRatio"
              axisLine={false}
              tickLine={false}
              hide
            />
            <defs>
              <linearGradient id="count-linear" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor={mainColor} stopOpacity={0.3} />
                <stop offset="100%" stopColor={mainColor} stopOpacity={0} />
              </linearGradient>
            </defs>
            <Area
              type="monotone"
              dataKey="confidenceRatio"
              stroke={mainColor}
              strokeWidth={2}
              fill="url(#count-linear)"
            />
            {/** Used to locate a specific position on the y-axis */}
            {data.map((item) => (
              <ReferenceDot
                key={item.confidenceRatio}
                x={item.forecastSlippage}
                y={item.confidenceRatio}
                r={1}
                fill={theme.palette.text.primary}
                stroke="none"
                className={dotClassName}
              />
            ))}
          </AreaChart>
        </Box>
      )}
    </Box>
  );
}

// Avoid re-rendering due to hover chart + slider
export default React.memo(CurveChart);
