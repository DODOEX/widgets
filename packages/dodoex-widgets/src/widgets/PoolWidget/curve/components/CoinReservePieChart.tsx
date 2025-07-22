import { Box, useTheme } from '@dodoex/components';
import { Cell, Pie, PieChart } from 'recharts';
import { AddressWithLinkAndCopy } from '../../../../components/AddressWithLinkAndCopy';
import {
  formatExponentialNotation,
  formatPercentageNumber,
  formatTokenAmountNumber,
} from '../../../../utils/formatter';
import TokenLogo from '../../../../components/TokenLogo';
import { useMemo } from 'react';
import { CurvePoolT } from '../types';
import { BigNumber } from 'bignumber.js';

const COLORS = [
  '#154618',
  '#ED4A25',
  '#0E794D',
  '#F7A33E',
  '#582969',
  '#DFCC28',
  '#294369',
  '#1D1D1D',
];

export interface CoinReservePieChartProps {
  poolDetail: CurvePoolT | undefined;
  tokenBalances: BigNumber[] | null;
}

export const CoinReservePieChart = ({
  poolDetail,
  tokenBalances,
}: CoinReservePieChartProps) => {
  const theme = useTheme();

  const coinReserveList = useMemo(() => {
    if (!poolDetail) {
      return [];
    }
    if (!tokenBalances) {
      return [];
    }
    const total = tokenBalances.reduce(
      (acc, token) => acc.plus(token),
      new BigNumber(0),
    );
    return poolDetail.coins.map((coin, index) => {
      return {
        name: coin.name,
        symbol: coin.symbol,
        address: coin.address,
        chainId: coin.chainId,
        decimals: coin.decimals,
        value: tokenBalances[index].toNumber(),
        percentage: tokenBalances[index].div(total).toNumber(),
        color: COLORS[index],
      };
    });
  }, [poolDetail, tokenBalances]);

  return (
    <Box
      sx={{
        mt: 16,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'stretch',
        gap: 28,
        p: 20,
        backgroundColor: theme.palette.background.paper,
        borderRadius: 16,
        [theme.breakpoints.up('tablet')]: {
          flexDirection: 'row',
          alignItems: 'center',
          border: `1px solid ${theme.palette.border.main}`,
          p: 0,
          gap: 0,
        },
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          [theme.breakpoints.up('tablet')]: {
            minWidth: 364,
            flexDirection: 'column',
            gap: 16,
          },
        }}
      >
        <PieChart width={88} height={88}>
          <Pie
            isAnimationActive={false}
            dataKey="value"
            data={coinReserveList}
            labelLine={false}
            label={false}
            outerRadius={44}
          >
            {coinReserveList.map((entry, index) => (
              <Cell
                // eslint-disable-next-line react/no-array-index-key
                key={`cell-${index}`}
                fill={entry.color}
                strokeWidth={0}
              />
            ))}
          </Pie>
        </PieChart>
        <Box
          sx={{
            display: 'none',
            [theme.breakpoints.up('tablet')]: {
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexWrap: 'wrap',
              gap: 16,
              maxWidth: 172,
            },
          }}
        >
          {coinReserveList.map((coin) => {
            return (
              <Box
                key={coin.address}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4,
                }}
              >
                <Box
                  sx={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    backgroundColor: coin.color,
                  }}
                />
                <Box
                  sx={{
                    typography: 'h6',
                    color: theme.palette.text.primary,
                  }}
                >
                  {coin.symbol}
                </Box>
              </Box>
            );
          })}
        </Box>
      </Box>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 16,
          [theme.breakpoints.up('tablet')]: {
            display: 'none',
          },
        }}
      >
        {coinReserveList.map((coin) => {
          return (
            <Box
              key={coin.address}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
              }}
            >
              <Box
                sx={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  backgroundColor: coin.color,
                }}
              />
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  gap: 4,
                }}
              >
                <Box
                  sx={{
                    typography: 'body2',
                    fontWeight: 600,
                    color: theme.palette.text.primary,
                  }}
                >
                  {coin.symbol}
                </Box>
                <AddressWithLinkAndCopy
                  address={coin.address}
                  customChainId={coin.chainId}
                  truncate
                  showCopy
                  iconDarkHover
                  iconSize={12}
                  iconSpace={4}
                  sx={{
                    typography: 'h6',
                    color: 'text.secondary',
                  }}
                />
              </Box>
              <Box
                sx={{
                  ml: 'auto',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-end',
                  gap: 4,
                }}
              >
                <Box
                  sx={{
                    typography: 'body2',
                    fontWeight: 600,
                    color: theme.palette.text.primary,
                    textAlign: 'right',
                  }}
                >
                  {formatTokenAmountNumber({
                    input: coin.value,
                    decimals: coin.decimals,
                  })}
                </Box>
                <Box
                  sx={{
                    typography: 'h6',
                    color: theme.palette.text.secondary,
                    textAlign: 'right',
                  }}
                >
                  (
                  {formatPercentageNumber({
                    input: new BigNumber(coin.percentage),
                    showDecimals: 2,
                  })}
                  )
                </Box>
              </Box>
            </Box>
          );
        })}
      </Box>
      <Box
        sx={{
          display: 'none',
          [theme.breakpoints.up('tablet')]: {
            flexGrow: 1,
            display: 'block',
            borderLeft: `1px solid ${theme.palette.border.main}`,
          },
        }}
      >
        <Box
          sx={{
            borderBottom: `1px solid ${theme.palette.border.main}`,
            typography: 'h6',
            fontWeight: 600,
            color: theme.palette.text.secondary,
            height: 48,
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <Box
            sx={{
              flexBasis: '150px',
              flexGrow: 1,
              flexShrink: 1,
              px: 20,
            }}
          >
            Asset
          </Box>
          <Box
            sx={{
              flexBasis: '150px',
              flexGrow: 1,
              flexShrink: 1,
              px: 20,
              textAlign: 'right',
            }}
          >
            Token Amount
          </Box>
          <Box
            sx={{
              flexBasis: '150px',
              flexGrow: 1,
              flexShrink: 1,
              px: 20,
              textAlign: 'right',
            }}
          >
            ratio
          </Box>
        </Box>
        {coinReserveList.map((coin) => {
          return (
            <Box
              key={coin.address}
              sx={{
                display: 'flex',
                alignItems: 'center',
                height: 56,
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  flexBasis: '150px',
                  flexGrow: 1,
                  flexShrink: 1,
                  px: 20,
                }}
              >
                <TokenLogo
                  address={coin.address}
                  width={24}
                  height={24}
                  chainId={coin.chainId}
                  url={undefined}
                  cross={false}
                  noShowChain
                  noBorder
                  marginRight={0}
                />
                <Box>
                  <Box
                    sx={{
                      typography: 'body2',
                      fontWeight: 600,
                      color: theme.palette.text.primary,
                    }}
                  >
                    {coin.symbol}
                  </Box>
                  <AddressWithLinkAndCopy
                    address={coin.address}
                    customChainId={coin.chainId}
                    truncate
                    showCopy
                    iconDarkHover
                    iconSize={12}
                    iconSpace={4}
                    sx={{
                      typography: 'h6',
                      color: 'text.secondary',
                    }}
                  />
                </Box>
              </Box>

              <Box
                sx={{
                  typography: 'body2',
                  fontWeight: 600,
                  color: theme.palette.text.primary,
                  textAlign: 'right',
                  flexBasis: '150px',
                  flexGrow: 1,
                  flexShrink: 1,
                  px: 20,
                }}
              >
                {formatTokenAmountNumber({
                  input: coin.value,
                  decimals: coin.decimals,
                })}
              </Box>

              <Box
                sx={{
                  typography: 'body2',
                  fontWeight: 600,
                  color: theme.palette.text.primary,
                  textAlign: 'right',
                  flexBasis: '150px',
                  flexGrow: 1,
                  flexShrink: 1,
                  px: 20,
                }}
              >
                {formatPercentageNumber({
                  input: new BigNumber(coin.percentage),
                  showDecimals: 2,
                })}
              </Box>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
};
