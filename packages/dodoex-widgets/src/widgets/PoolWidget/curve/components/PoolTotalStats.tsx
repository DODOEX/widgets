import { Box, useTheme } from '@dodoex/components';
import BigNumber from 'bignumber.js';
import {
  formatExponentialNotation,
  formatPercentageNumber,
} from '../../../../utils/formatter';
import { CurvePoolT } from '../types';

export interface PoolTotalStatsProps {
  poolDetail: CurvePoolT | undefined;
}

export const PoolTotalStats = ({ poolDetail }: PoolTotalStatsProps) => {
  const theme = useTheme();

  const poolDataList = [
    {
      title: 'Trader',
      value: formatExponentialNotation(new BigNumber('1770')),
    },
    {
      title: 'Total Liquidity',
      value: `$${formatExponentialNotation(new BigNumber('381800'))}`,
    },
    {
      title: 'Volume',
      value: `$${formatExponentialNotation(new BigNumber('159820'))}`,
    },
    {
      title: 'Fees',
      value: formatPercentageNumber({
        input: new BigNumber('0.0002'),
        showDecimals: 2,
      }),
    },
  ];

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gridTemplateRows: 'repeat(2, 1fr)',
        gap: 12,
        [theme.breakpoints.up('tablet')]: {
          gridTemplateColumns: 'repeat(4, 1fr)',
          gridTemplateRows: 'repeat(1, 1fr)',
        },
      }}
    >
      {poolDataList.map((item, index) => {
        return (
          <Box
            key={index}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              p: 16,
              borderRadius: 8,
              backgroundColor: theme.palette.background.paper,
              [theme.breakpoints.up('tablet')]: {
                border: `1px solid ${theme.palette.border.main}`,
              },
            }}
          >
            <Box
              sx={{
                typography: 'caption',
                color: theme.palette.text.primary,
              }}
            >
              {item.value}
            </Box>
            <Box
              sx={{
                typography: 'h6',
                color: theme.palette.text.secondary,
              }}
            >
              {item.title}
            </Box>
          </Box>
        );
      })}
    </Box>
  );
};
