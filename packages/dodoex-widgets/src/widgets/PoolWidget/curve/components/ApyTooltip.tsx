import { Box, BoxProps, Tooltip, useTheme } from '@dodoex/components';
import { formatPercentageNumber } from '../../../../utils';

export function ApyTooltip({
  apy,
  dailyApy,
  weeklyApy,
  sx,
}: {
  apy: string | null | undefined;
  dailyApy: string | null | undefined;
  weeklyApy: string | null | undefined;
  sx?: BoxProps['sx'];
}) {
  const theme = useTheme();

  return (
    <Tooltip
      title={
        <Box
          sx={{
            maxWidth: 216,
            typography: 'h6',
            fontWeight: 500,
            color: 'text.secondary',
          }}
        >
          <Box sx={{ fontWeight: 700 }}>Base vAPY (annualized)</Box>
          <Box component="ul" sx={{ pl: 16, my: 0 }}>
            <li>
              Daily: 
              {formatPercentageNumber({ input: dailyApy, showDecimals: 2 })}
            </li>
            <li>
              Weekly: 
              {formatPercentageNumber({ input: weeklyApy, showDecimals: 2 })}
            </li>
          </Box>
          <br />
          *Variable APY based on today’s trading activity
        </Box>
      }
    >
      <Box
        component="span"
        sx={{
          fontWeight: 600,
          display: 'flex',
          alignItems: 'center',
          width: 'max-content',
          color: 'success.main',
          cursor: 'auto',
          typography: 'h5',
          [theme.breakpoints.up('tablet')]: {
            typography: 'body2',
          },
          ...sx,
        }}
      >
        {formatPercentageNumber({ input: apy, showDecimals: 2 })}
      </Box>
    </Tooltip>
  );
}
