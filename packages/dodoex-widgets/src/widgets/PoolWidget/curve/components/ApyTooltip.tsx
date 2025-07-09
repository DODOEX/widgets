import { Box, Tooltip } from '@dodoex/components';
import { formatPercentageNumber } from '../../../../utils';

export function ApyTooltip({
  apy,
  dailyApy,
  weeklyApy,
}: {
  apy: string | null;
  dailyApy: string | null;
  weeklyApy: string | null;
}) {
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
          typography: 'body2',
          fontWeight: 600,
          display: 'flex',
          alignItems: 'center',
          width: 'max-content',
          color: 'success.main',
          cursor: 'auto',
        }}
      >
        {formatPercentageNumber({ input: apy, showDecimals: 2 })}
      </Box>
    </Tooltip>
  );
}
