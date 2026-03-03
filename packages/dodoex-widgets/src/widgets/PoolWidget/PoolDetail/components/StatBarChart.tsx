import { alpha, Box, useTheme, ButtonBase } from '@dodoex/components';
import dayjs from 'dayjs';
import React from 'react';
import { formatReadableNumber, formatShortNumber } from '../../../../utils';
import { Bar, BarChart, ReferenceLine, Tooltip, XAxis, YAxis } from 'recharts';
import BigNumber from 'bignumber.js';
import { t } from '@lingui/macro';
import { useWidgetDevice } from '../../../../hooks/style/useWidgetDevice';

type BaseData = Record<string, number>;

export default function StatBarChart<T extends BaseData, U extends BaseData>({
  unit,
  data,
  dayData,
  hourData,
  masterKey,
  sumKey,
  investorsCount,
}: {
  unit: string;
  data?: T[];
  dayData?: Array<T & { date: number }>;
  hourData?: Array<U & { hour: number }>;
  masterKey: keyof U;
  sumKey: keyof U;
  investorsCount?: string | number;
}) {
  const [active, setActive] = React.useState<'hour' | 'date'>('hour');
  const [currentData, setCurrentData] = React.useState<
    (U & { date?: number; hour?: number }) | null
  >(null);

  // Support both old API (single data) and new API (dayData + hourData)
  const actualData = React.useMemo(() => {
    if (dayData && hourData) {
      return active === 'hour' ? hourData : dayData;
    }
    return data || [];
  }, [data, dayData, hourData, active]);

  const showTimePicker = !!(dayData && hourData);

  const theme = useTheme();
  const { isMobile } = useWidgetDevice();
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
      ? theme.palette.secondary.main
      : theme.palette.primary.main;

  const lastData = actualData[actualData.length - 1];
  const ticksY = React.useMemo(() => {
    if (!actualData || actualData.length === 0) return [0];
    let max = (actualData[0] as U)[masterKey] || 0;
    actualData.forEach((d: any) => {
      if (d[masterKey] > max) max = d[masterKey];
    });
    // If max is 0 or very small, return a simple tick array to avoid duplicate keys
    if (max === 0) return [0];
    return [0, Math.ceil(max / 3), Math.ceil((max / 3) * 2), max];
  }, [actualData, masterKey]);

  if (!lastData) return null;

  return (
    <Box
      ref={chartParentRef}
      sx={{
        position: 'relative',
        flexGrow: 1,
        mt: 12,
      }}
    >
      <Box
        sx={{
          mb: 10,
        }}
      >
        <Box
          sx={{
            mb: 8,
            lineHeight: '33px',
            fontSize: 20,
            fontWeight: 500,
          }}
        >
          {formatReadableNumber({
            input:
              (currentData
                ? (currentData as U)[masterKey]
                : sumKey === 'investors'
                  ? investorsCount
                  : (lastData as U)[sumKey]) || '',
          })}{' '}
          {unit}
        </Box>
        <Box
          sx={{
            fontSize: 14,
            color: 'text.secondary',
          }}
        >
          {dayjs(currentData ? currentData[active] : lastData[active]).format(
            active === 'date' ? 'LL' : 'LLL',
          )}
        </Box>
      </Box>

      {showTimePicker && (
        <Box
          sx={{
            position: 'absolute',
            top: 7,
            right: 0,
            display: 'flex',
            background: 'background.paper',
            border: '1px solid',
            borderColor: 'border.main',
            borderRadius: '4px',
          }}
        >
          <ButtonBase
            onClick={() => setActive('hour')}
            sx={{
              borderRadius: '2px',
              color: active === 'hour' ? 'text.primary' : 'text.secondary',
              px: 8,
              py: 3,
              fontSize: 12,
              fontWeight: active === 'hour' ? 500 : 400,
              backgroundColor:
                active === 'hour' ? 'border.main' : 'transparent',
            }}
          >
            {t`1H`}
          </ButtonBase>
          <ButtonBase
            onClick={() => setActive('date')}
            sx={{
              borderRadius: '2px',
              color: active === 'date' ? 'text.primary' : 'text.secondary',
              px: 8,
              py: 3,
              fontSize: 12,
              fontWeight: active === 'date' ? 500 : 400,
              backgroundColor:
                active === 'date' ? 'border.main' : 'transparent',
            }}
          >
            {t`1D`}
          </ButtonBase>
        </Box>
      )}

      <BarChart
        barGap={2}
        barSize={44}
        width={chartWidth}
        height={isMobile ? 261 : 400}
        data={actualData}
        margin={{
          top: 15,
          right: -8,
          left: -8,
          bottom: -8,
        }}
      >
        <defs>
          <linearGradient id="colorBar" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor={chartBg} />
            <stop offset="100%" stopColor={alpha(chartBg, 0.04)} />
          </linearGradient>
        </defs>
        <XAxis
          dataKey={active}
          axisLine={false}
          tickFormatter={(value) =>
            dayjs(value).format(active === 'date' ? 'MM-DD' : 'HH:mm')
          }
        />
        <YAxis
          orientation="right"
          axisLine={false}
          width={30}
          ticks={ticksY}
          domain={['dataMin', 'dataMax']}
          tickFormatter={(value) => formatShortNumber(new BigNumber(value))}
        />
        <Bar
          dataKey={masterKey as string}
          fill="url(#colorBar)"
          onMouseMove={(barData) => {
            setReferenceLineX(barData[active]);
            setCurrentData(barData.payload);
          }}
          onMouseLeave={() => {
            setReferenceLineX(null);
            setCurrentData(null);
          }}
        />
        <Tooltip
          isAnimationActive={false}
          content={({ active: tActive, payload, label }) => {
            if (tActive && payload && label) {
              const { value } = payload[0];
              return (
                <Box
                  sx={{
                    px: 12,
                    py: 12,
                    borderRadius: 8,
                    backgroundColor: 'border.main',
                    fontSize: 12,
                    fontWeight: 500,
                  }}
                >
                  <Box sx={{ mr: 8 }}>
                    {dayjs(label).format(
                      active === 'date' ? 'MM-DD' : 'MM-DD HH:mm',
                    )}
                  </Box>
                  <Box>
                    {value !== undefined
                      ? formatReadableNumber({
                          input: String(value),
                          showDecimals: 4,
                        })
                      : '-'}
                    {unit}
                  </Box>
                </Box>
              );
            }
            return null;
          }}
          cursor={false}
          coordinate={{ x: 0, y: 0 }}
        />
        {referenceLineX && (
          <ReferenceLine
            x={referenceLineX}
            stroke="#ffe804"
            strokeDasharray="3 3"
          />
        )}
      </BarChart>
    </Box>
  );
}
