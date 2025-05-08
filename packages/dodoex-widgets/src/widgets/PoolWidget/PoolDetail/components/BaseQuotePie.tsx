import { Box, BoxProps, Skeleton, useTheme } from '@dodoex/components';
import BigNumber from 'bignumber.js';
import { Cell, Pie, PieChart } from 'recharts';
import { formatReadableNumber, formatShortNumber } from '../../../../utils';
import { AddressWithLinkAndCopy } from '../../../../components/AddressWithLinkAndCopy';
import { ChainId } from '@dodoex/api';

export function BaseQuotePie({
  chainId,
  shortNumber,
  pieSize = 'default',
  baseReserve = new BigNumber(1),
  baseAmount = new BigNumber(1),
  quoteAmount = new BigNumber(0),
  baseTokenSymbol = '-',
  quoteTokenSymbol = '-',
  quoteTokenDecimals = 18,
  baseTokenDecimals = 18,
  baseTokenAddress,
  quoteTokenAddress,
  baseTvlRate,
  quoteTvlRate,
  disabledAmount,
  disabledRate,
  disabledPercentage,
  loading,
  sx,
  pieRadius: pieRadiusProp,
}: {
  chainId?: ChainId;
  baseReserve?: BigNumber;
  /** Quantity converted by midPrice, used to calculate percentages */
  baseAmount?: BigNumber;
  baseTokenDecimals?: number;
  baseTokenSymbol?: string;
  quoteAmount?: BigNumber;
  quoteTokenDecimals?: number;
  quoteTokenSymbol?: string;
  baseTokenAddress?: string;
  quoteTokenAddress?: string;
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
  const symbolMarginTop = isSmall ? 6 : 16;
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
        justifyContent: 'space-between',
        flexDirection: 'column',
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
        className="symbol-wrapper"
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          ml: 0,
          mt: 16,
          width: '100%',

          '& > div': {
            paddingLeft: '12px',
            position: 'relative',
            '&::before': {
              content: '""',
              width: '8px',
              height: '8px',
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
              justifyContent: 'space-between',
            }}
          >
            <Box>
              <Box
                className="symbol"
                title={baseTokenSymbol}
                sx={{
                  typography: 'h6',
                }}
              >
                {baseTokenSymbol}
              </Box>
              {baseTokenAddress ? (
                <AddressWithLinkAndCopy
                  address={baseTokenAddress}
                  customChainId={chainId}
                  truncate
                  showCopy
                  size="small"
                  iconSpace={4}
                  sx={{
                    typography: 'h6',
                    color: 'text.secondary',
                  }}
                />
              ) : (
                ''
              )}
            </Box>
            <Box
              sx={{
                textAlign: 'right',
              }}
            >
              {!disabledAmount ? `${baseAmountText} ` : ''}
              {disabledPercentage || disabledRate ? (
                ''
              ) : (
                <Box
                  sx={{
                    color: 'text.secondary',
                    typography: 'h6',
                    fontWeight: 600,
                  }}
                >
                  &nbsp;{`(${basePercentage}%)`}
                </Box>
              )}
            </Box>
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
              justifyContent: 'space-between',
              marginTop: `${symbolMarginTop}px`,
            }}
          >
            <Box>
              <Box
                className="symbol"
                title={quoteTokenSymbol}
                sx={{
                  typography: 'h6',
                }}
              >
                {quoteTokenSymbol}
              </Box>
              {quoteTokenAddress ? (
                <AddressWithLinkAndCopy
                  address={quoteTokenAddress}
                  customChainId={chainId}
                  truncate
                  showCopy
                  size="small"
                  iconSpace={4}
                  sx={{
                    typography: 'h6',
                    color: 'text.secondary',
                  }}
                />
              ) : (
                ''
              )}
            </Box>
            <Box
              sx={{
                textAlign: 'right',
              }}
            >
              {!disabledAmount ? `${quoteAmountText} ` : ''}
              {disabledPercentage || disabledRate ? (
                ''
              ) : (
                <Box
                  sx={{
                    color: 'text.secondary',
                    typography: 'h6',
                    fontWeight: 600,
                  }}
                >
                  &nbsp;{`(${quotePercentage}%)`}
                </Box>
              )}
            </Box>
          </Box>
        )}
      </Box>
    </Box>
  );
}
