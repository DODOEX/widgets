import { alpha, Box, useTheme } from '@dodoex/components';
import dayjs from 'dayjs';
import React from 'react';
import { formatReadableNumber, formatShortNumber } from '../../../../utils';
import { usePoolDayData } from '../hooks/usePoolDayData';
import {
  Bar,
  BarChart,
  Cell,
  ReferenceLine,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import BigNumber from 'bignumber.js';
import { Trans } from '@lingui/macro';

type DayData = ReturnType<typeof usePoolDayData>['dayDataList']['0'];

export default function StatBarChart({
  unit,
  data,
  masterKey,
  sumKey,
}: {
  unit: string;
  data: DayData[];
  masterKey: keyof DayData;
  sumKey: keyof DayData;
}) {
  const theme = useTheme();
  const chartParentRef = React.useRef<HTMLDivElement>(null);
  const [referenceLineX, setReferenceLineX] = React.useState<number | null>(
    null,
  );

  const [chartWidth, setChartWidth] = React.useState(0);
  React.useEffect(() => {
    const handleChangeChartWidth = () => {
      if (!chartParentRef || !chartParentRef.current) return;
      setChartWidth(chartParentRef.current.offsetWidth);
    };
    setTimeout(handleChangeChartWidth, 100);

    window.addEventListener('resize', handleChangeChartWidth);
    return () => {
      window.removeEventListener('resize', handleChangeChartWidth);
    };
  }, [chartParentRef]);

  const chartBg =
    theme.palette.mode === 'light'
      ? alpha(theme.palette.success.main, 0.6)
      : theme.palette.primary.main;
  const chartBgCurrentDay = '#ff9553';

  const lastData = data[data.length - 2];
  const active = 'date';
  let ticksY: number[] = [];
  if (data?.length) {
    let max = data[0][masterKey];
    data.forEach((d) => {
      if (d[masterKey] > max) max = d[masterKey];
    });
    if (max) {
      ticksY = [0, Math.ceil(max / 3), Math.ceil((max / 3) * 2), max];
    } else {
      ticksY = [0];
    }
  }
  let maxLen = 0;
  ticksY.forEach((num) => {
    const text = formatShortNumber(new BigNumber(num));
    let len = text.replace('.', '').length;
    if (text.indexOf('.') > -1) {
      len += 0.11;
    }
    if (len > maxLen) {
      maxLen = len;
    }
  });
  const ticksYWidth = maxLen * 10 + 2;

  return (
    <Box
      ref={chartParentRef}
      sx={{
        position: 'relative',
      }}
    >
      <Box
        sx={{
          minHeight: 62,
          mb: 10,
        }}
      >
        <Box
          sx={{
            typography: 'caption',
            mb: 8,
          }}
        >
          {unit || <span>&nbsp;</span>}
          {formatReadableNumber({ input: lastData?.[sumKey] })}
        </Box>
        <Box
          sx={{
            color: 'text.secondary',
          }}
        >
          {dayjs(lastData?.[active]).format('LL')}
        </Box>
      </Box>

      <BarChart
        width={chartWidth}
        height={364}
        data={data}
        margin={{
          top: 5,
          right: 10,
          left: 0,
          bottom: 5,
        }}
      >
        <defs>
          {data.map((entry, index) => (
            <linearGradient
              key={entry.date}
              id={`colorBar${entry.date}`}
              x1="0"
              x2="0"
              y1="0"
              y2="1"
            >
              <stop
                offset="0%"
                stopColor={
                  index === data.length - 1 ? chartBgCurrentDay : chartBg
                }
              />
              <stop
                offset="100%"
                stopColor={alpha(
                  index === data.length - 1 ? chartBgCurrentDay : chartBg,
                  0.04,
                )}
              />
            </linearGradient>
          ))}
        </defs>
        <XAxis
          hide
          dataKey={active}
          axisLine={false}
          tickFormatter={(value) =>
            dayjs(value).format(active === 'date' ? 'MM-DD' : 'HH:mm')
          }
        />
        <YAxis
          orientation="right"
          axisLine={false}
          ticks={ticksY}
          width={ticksYWidth}
          tickFormatter={(value) => formatShortNumber(new BigNumber(value))}
        />
        <Tooltip
          isAnimationActive={false}
          content={({ active: tActive, payload, label }) => {
            const open = tActive && payload && payload.length;
            if (!open) return null;
            const isRealTime =
              dayjs(label).format('YYYY-MM-DD') ===
              dayjs().format('YYYY-MM-DD');
            return (
              <Box
                sx={{
                  px: 10,
                  py: 12,
                  maxWidth: 240,
                  borderRadius: 8,
                  backgroundColor: 'background.paperContrast',
                  typography: 'h6',
                  color: 'text.secondary',
                }}
              >
                <Box sx={{ mr: 8 }}>{dayjs(label).format('MM-DD HH:mm')}</Box>
                <Box>{payload[0].value}</Box>
                {isRealTime ? (
                  <Box>
                    <Trans>Real Time</Trans>
                  </Box>
                ) : (
                  ''
                )}
              </Box>
            );
          }}
          cursor={false}
          coordinate={{ x: 0, y: 0 }}
        />
        <Bar
          dataKey={masterKey}
          onMouseMove={(barData) => {
            setReferenceLineX(barData[active]);
          }}
          onMouseLeave={() => {
            setReferenceLineX(null);
          }}
        >
          {data.map((entry) => (
            <Cell key={entry.date} fill={`url(#colorBar${entry.date})`} />
          ))}
        </Bar>
        {referenceLineX && (
          <ReferenceLine
            x={referenceLineX}
            stroke={chartBg}
            strokeDasharray="3 3"
          />
        )}
      </BarChart>
    </Box>
  );
}
