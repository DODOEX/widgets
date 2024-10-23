import { Box, BoxProps, Skeleton, useTheme } from '@dodoex/components';
import BigNumber from 'bignumber.js';
import { Cell, Pie, PieChart } from 'recharts';
import { formatReadableNumber, formatShortNumber } from '../../../../utils';

export function BaseQuotePie({
  shortNumber,
  pieSize = 'default',
  baseReserve = new BigNumber(1),
  baseAmount = new BigNumber(1),
  quoteAmount = new BigNumber(0),
  baseTokenSymbol = '-',
  quoteTokenSymbol = '-',
  quoteTokenDecimals = 18,
  baseTokenDecimals = 18,
  baseTvlRate,
  quoteTvlRate,
  disabledAmount,
  disabledRate,
  disabledPercentage,
  loading,
  sx,
  pieRadius: pieRadiusProp,
}: {
  baseReserve?: BigNumber;
  /** Quantity converted by midPrice, used to calculate percentages */
  baseAmount?: BigNumber;
  baseTokenDecimals?: number;
  baseTokenSymbol?: string;
  quoteAmount?: BigNumber;
  quoteTokenDecimals?: number;
  quoteTokenSymbol?: string;
  // radius: 23px 30px
  pieSize?: 'small' | 'default';
  shortNumber?: boolean;
  /** Already calculated proportion */
  baseTvlRate?: string;
  quoteTvlRate?: string;
  disabledAmount?: boolean;
  disabledRate?: boolean;
  disabledPercentage?: boolean;
  loading?: boolean;
  sx?: BoxProps['sx'];
  pieRadius?: number;
}) {
  const theme = useTheme();
  const isSmall = pieSize === 'small';
  const pieMarginRight = isSmall ? 10 : 20;
  const symbolMarginTop = isSmall ? 6 : 13;
  const pieRadius = pieRadiusProp || (isSmall ? 23 : 30);

  const baseTokenShowDecimals =
    baseTokenDecimals > 6 ? 6 : baseTokenDecimals > 4 ? 4 : 2;
  const quoteTokenShowDecimals =
    quoteTokenDecimals > 6 ? 6 : quoteTokenDecimals > 4 ? 4 : 2;

  const baseAmountText = shortNumber
    ? formatShortNumber(new BigNumber(baseReserve))
    : formatReadableNumber({
        input: baseReserve,
        showDecimals: baseTokenShowDecimals,
      });
  const quoteAmountText = shortNumber
    ? formatShortNumber(new BigNumber(quoteAmount))
    : formatReadableNumber({
        input: quoteAmount,
        showDecimals: quoteTokenShowDecimals,
      });
  let total = baseAmount.plus(quoteAmount);
  total = total.lte(0) ? new BigNumber(1) : total;
  const basePercentage =
    baseTvlRate || baseAmount.div(total).multipliedBy(100).toFixed(2);
  const quotePercentage =
    quoteTvlRate || quoteAmount.div(total).multipliedBy(100).toFixed(2);

  const isEmpty = baseAmount.lte(0) && quoteAmount.lte(0);
  const baseColor = theme.palette.purple.main;
  const quoteColor = theme.palette.secondary.main;
  const data = [
    {
      name: 'base',
      value: isEmpty ? 1 : baseAmount.toNumber(),
      color: baseColor,
    },
    {
      name: 'quote',
      value: isEmpty ? 1 : quoteAmount.toNumber(),
      color: quoteColor,
    },
  ];

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        ...(sx || {}),
      }}
    >
      <div>
        {disabledPercentage ? (
          ''
        ) : loading ? (
          <Skeleton width={46} height={46} variant="circular" />
        ) : (
          <PieChart width={pieRadius * 2} height={pieRadius * 2}>
            <Pie
              isAnimationActive={false}
              dataKey="value"
              data={data}
              labelLine={false}
              label={false}
              outerRadius={pieRadius}
              fill={quoteColor}
            >
              {data.map((entry, index) => (
                <Cell
                  // eslint-disable-next-line react/no-array-index-key
                  key={`cell-${index}`}
                  fill={entry.color}
                  strokeWidth={0}
                />
              ))}
            </Pie>
          </PieChart>
        )}
      </div>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          marginLeft: pieMarginRight,

          '& > div': {
            paddingLeft: '16px',
            position: 'relative',
            '&::before': {
              content: '""',
              width: '6px',
              height: '6px',
              position: 'absolute',
              left: '0',
              top: '50%',
              transform: 'translateY(-50%)',
              backgroundColor: theme.palette.purple.main,
              borderRadius: '50%',
            },
            '&:last-child::before': {
              backgroundColor: quoteColor,
            },

            '&> span.symbol': {
              display: 'inline-block',
              maxWidth: '6em',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              verticalAlign: 'text-bottom',
            },
          },
        }}
      >
        {loading ? (
          <Skeleton width={237} sx={{ borderRadius: 4 }} />
        ) : (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
            }}
          >
            {!disabledAmount ? `${baseAmountText} ` : ''}
            <span className="symbol" title={baseTokenSymbol}>
              {baseTokenSymbol}
            </span>
            {disabledPercentage || disabledRate ? (
              ''
            ) : (
              <Box
                component="span"
                sx={{
                  color: 'text.secondary',
                }}
              >
                &nbsp;{`(${basePercentage}%)`}
              </Box>
            )}
          </Box>
        )}
        {loading ? (
          <Skeleton
            width={237}
            sx={{ borderRadius: 4, marginTop: `${symbolMarginTop}px` }}
          />
        ) : (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              marginTop: `${symbolMarginTop}px`,
            }}
          >
            {!disabledAmount ? `${quoteAmountText} ` : ''}
            <span className="symbol" title={quoteTokenSymbol}>
              {quoteTokenSymbol}
            </span>
            {disabledPercentage || disabledRate ? (
              ''
            ) : (
              <Box
                component="span"
                sx={{
                  color: 'text.secondary',
                }}
              >
                &nbsp;{`(${quotePercentage}%)`}
              </Box>
            )}
          </Box>
        )}
      </Box>
    </Box>
  );
}
